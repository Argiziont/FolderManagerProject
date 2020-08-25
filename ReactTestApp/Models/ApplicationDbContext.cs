using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using System.Collections.Generic;

namespace ReactTestApp.Models
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Folder> Folders { get; set; }
        public DbSet<FileHolder> Files { get; set; }

        //protected override void OnModelCreating(ModelBuilder modelBuilder)
        //{
        //    //settind Standart model data
        //    //modelBuilder.Entity<Folder>().HasData(
        //    //new Folder[] {

        //    //new Folder {Id=1,Name="Pictures",   Files=new List<FileHolder>{new FileHolder{ Id = 1, Name ="red.png"}, new FileHolder { Id = 2, Name = "purple.jpg" }, new FileHolder { Id = 3, Name = "green.exe" } } },
        //    //new Folder {Id=2,Name="Music",      Files=new List<FileHolder>{new FileHolder{ Id = 1, Name = "Zack.pg" }, new FileHolder { Id = 2, Name = "Files.ini" } } },
        //    //new Folder {Id=3,Name="Documents",  Files=new List<FileHolder>{new FileHolder{ Id = 1, Name = "Elis.exe" } } },
        //    //new Folder {Id=4,Name="Other Files",Files=new List<FileHolder>{new FileHolder{ Id = 1, Name ="red.png"}, new FileHolder { Id = 2, Name = "Open.exp" }, new FileHolder { Id = 3, Name = "colors.ini" } } },
        //    //new Folder {Id=5,Name="My files",   Files=null,}

        //    // });

        //}
    }
}
