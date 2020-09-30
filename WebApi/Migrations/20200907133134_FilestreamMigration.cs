using Microsoft.EntityFrameworkCore.Migrations;

namespace FolderProjectApp.Migrations
{
    public partial class FilestreamMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.Sql("alter table [dbo].[Files] add [FileId] uniqueidentifier rowguidcol not null");
            migrationBuilder.Sql("alter table [dbo].[Files] add constraint [UQ_Files_FileId] UNIQUE NONCLUSTERED ([FileId])");
            migrationBuilder.Sql("alter table [dbo].[Files] add constraint [DF_Files_FileId] default (newid()) for [FileId]");
            migrationBuilder.Sql("alter table [dbo].[Files] add [FileStreamData] varbinary(max) FILESTREAM not null");
            migrationBuilder.Sql("alter table [dbo].[Files] add constraint [DF_Files_Data] default(0x) for [FileStreamData]");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("alter table [dbo].[Files] drop constraint [DF_Files_Data]");
            migrationBuilder.Sql("alter table [dbo].[Files] drop column [FileStreamData]");

            migrationBuilder.Sql("alter table [dbo].[Files] drop constraint [UQ_Files_FileId]");
            migrationBuilder.Sql("alter table [dbo].[Files] drop constraint [DF_Files_FileId]");
            migrationBuilder.Sql("alter table [dbo].[Files] drop column [FileId]");
        }
    }
}
