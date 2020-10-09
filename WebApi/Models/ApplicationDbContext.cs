using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.DependencyInjection;
using FolderProjectApp.Models.AuthModel;
using System.Collections.Generic;
using FolderProjectApp.Services.Interfaces;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Threading.Tasks;

namespace FolderProjectApp.Models
{
    public class ApplicationDbContext : DbContext, IApplicationDbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {

        }

        public DbSet<Folder> Folders { get; set; }
        public DbSet<FileHolder> Files { get; set; }
        public DbSet<User> Users { get; set; }

        public DatabaseFacade GetDatabase()
        {
           return base.Database;
        }

        public Task<List<Folder>> ListAsync()
        {
            throw new System.NotImplementedException();
        }

        public int SaveDatabaseChanges()
        {
            return base.SaveChanges();
        }

    }
}
