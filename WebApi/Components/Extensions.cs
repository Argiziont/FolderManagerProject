using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.Data.SqlTypes;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace FolderProjectApp.Components
{
    public static class Extensions
    {
        public static byte[] ReadAllBytes(this Stream source)
        {
            long originalPosition = source.Position;
            source.Position = 0;
            try
            {
                byte[] readBuffer = new byte[4096];
                int totalBytesRead = 0;
                int bytesRead;
                while ((bytesRead = source.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;
                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = source.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                source.Position = originalPosition;
            }
        }

        public static void ReadFileStream(SqlConnectionStringBuilder connStringBuilder, int colId, string fileName, Stream str)
        {
            using (SqlConnection connection = new SqlConnection(connStringBuilder.ToString()))
            {

                connection.Open();
                SqlCommand command = new SqlCommand($"SELECT TOP({colId}) FileStreamData.PathName(), GET_FILESTREAM_TRANSACTION_CONTEXT() FROM Files WHERE Id={colId}", connection);

                SqlTransaction tran = connection.BeginTransaction(IsolationLevel.ReadCommitted);
                command.Transaction = tran;

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Get the pointer for the file
                        string path = reader.GetString(0);
                        byte[] transactionContext = reader.GetSqlBytes(1).Buffer;
                        List<byte> byteRead = new List<byte>();
                        // Create the SqlFileStream
                        using (Stream fileSQLStream = new SqlFileStream(path, transactionContext, FileAccess.Read, FileOptions.SequentialScan, allocationSize: 0))
                        {

                            int highLevelDivider = 200;
                            long highLevelChunkSize = fileSQLStream.Length / highLevelDivider;
                            List<long> highLevelSizeList = Enumerable.Repeat(highLevelChunkSize, highLevelDivider).ToList();
                            for (int i = 0; i < highLevelSizeList.Count; i++)
                            {
                                if (SumOfElements(highLevelSizeList) == fileSQLStream.Length)
                                {
                                    break;
                                }
                                else
                                {
                                    highLevelSizeList[i]++;
                                }
                            }

                            for (int i = 0; i < highLevelDivider; i++)
                            {
                                byte[] highLevelBuffer = new byte[highLevelSizeList[i]];//1MB LowLvlChunk chunk
                                fileSQLStream.Read(highLevelBuffer, 0, highLevelBuffer.Length);
                                using (Stream fileChunk = new MemoryStream(highLevelBuffer))
                                {
                                    str.Write(ReadAllBytes(fileChunk));
                                }
                            }


                        }
                    }
                }
                tran.Commit();
            }
        }
        public static async Task InsertFileStream(SqlConnectionStringBuilder connStringBuilder, int colId, Stream file)
        {
            using (SqlConnection connection = new SqlConnection(connStringBuilder.ToString()))
            {
                connection.Open();

                SqlCommand command = new SqlCommand($"SELECT TOP({colId}) FileStreamData.PathName(), GET_FILESTREAM_TRANSACTION_CONTEXT() FROM Files WHERE Id={colId}", connection);

                SqlTransaction tran = connection.BeginTransaction(IsolationLevel.ReadCommitted);
                command.Transaction = tran;

                using (SqlDataReader reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Get the pointer for file
                        string path = reader.GetString(0);

                        byte[] transactionContext = reader.GetSqlBytes(1).Buffer;

                        using (Stream fileStream = new SqlFileStream(path, transactionContext, FileAccess.Write, FileOptions.SequentialScan, allocationSize: 0))
                        {

                            //using (FileStream file = System.IO.File.Open($@"Input\{fileName}", FileMode.Open))
                            // {
                            int highLevelDivider = 200;
                            long highLevelChunkSize = file.Length / highLevelDivider;
                            List<long> highLevelSizeList = Enumerable.Repeat(highLevelChunkSize, highLevelDivider).ToList();
                            for (int i = 0; i < highLevelSizeList.Count; i++)
                            {
                                if (SumOfElements(highLevelSizeList) == file.Length)
                                {
                                    break;
                                }
                                else
                                {
                                    highLevelSizeList[i]++;
                                }
                            }
                            for (int i = 0; i < highLevelDivider; i++)
                            {
                                byte[] highLevelBuffer = new byte[highLevelSizeList[i]];
                                file.Read(highLevelBuffer, 0, highLevelBuffer.Length);
                                using (Stream fileChunk = new MemoryStream(highLevelBuffer))
                                {
                                    int prevChunk = 16384;
                                    long divider = FindCloseDivider(fileChunk.Length, prevChunk);
                                    long parts = fileChunk.Length / divider;

                                    byte[] lowLevelBuffer = new byte[divider];

                                    using (MemoryStream ms = new MemoryStream())
                                    {

                                        int read = fileChunk.Read(lowLevelBuffer, 0, lowLevelBuffer.Length);
                                        do
                                        {
                                            await fileStream.WriteAsync(lowLevelBuffer, 0, read);
                                        } while ((read = fileChunk.Read(lowLevelBuffer, 0, lowLevelBuffer.Length)) > 0);
                                    }
                                }
                            }
                            //}
                        }
                    }
                }
                tran.Commit();
            }

        }
        private static long FindCloseDivider(long number, int primaryDivider)
        {
            while (primaryDivider >= 0)
            {
                if (number % primaryDivider == 0)
                {
                    return primaryDivider;
                }
                else
                {
                    primaryDivider--;
                }

                if (primaryDivider < 4096)
                {
                    return number;
                }

            }
            return number;
        }
        private static long SumOfElements(List<long> numbers)
        {
            long sum = 0;
            foreach (long number in numbers)
            {
                sum += number;
            }
            return sum;
        }
        public static ActionResult Result(HttpStatusCode statusCode, string reason) => new ContentResult
        {
            StatusCode = (int)statusCode,
            Content = $"Status Code: {(int)statusCode}; {statusCode}; {reason}",
            ContentType = "text/plain",
        };
    }
}
