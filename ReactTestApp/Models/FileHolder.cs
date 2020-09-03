using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTestApp.Models
{
    public class FileHolder
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public long Size { get; set; }
        public byte[] File { get; set; }

        public int FolderId { get; set; }
        public Folder Folder { get; set; } 
    }
}
