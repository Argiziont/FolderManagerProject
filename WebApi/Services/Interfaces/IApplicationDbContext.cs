using FolderProjectApp.Models;
using FolderProjectApp.Models.AuthModel;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FolderProjectApp.Services.Interfaces
{
    public interface IApplicationDbContext
    {
        public DbSet<Folder> Folders { get; set; }
        public DbSet<FileHolder> Files { get; set; }
        public DbSet<User> Users { get; set; }
        public DatabaseFacade GetDatabase();
        Task<List<Folder>> ListAsync();
        public int SaveDatabaseChanges();
    }
}
