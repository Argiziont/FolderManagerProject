using FolderProjectApp.Models.AuthModel;
using FolderProjectApp.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FolderProjectApp.Models.Entity
{
    public class EFFileFolderContext : IEFFileFolderContext
    {
        private readonly ApplicationDbContext _dbContext;

        public EFFileFolderContext(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task AddFileAsync(FileHolder file)
        {
            _dbContext.Files.Add(file);
            return _dbContext.SaveChangesAsync();
        }

        public Task AddFolderAsync(Folder folder)
        {
            _dbContext.Folders.Add(folder);
            return _dbContext.SaveChangesAsync();
        }

        public Task<Folder> GetFolderByIdAsync(int id)
        {
            return _dbContext.Folders
                 .Include(s => s.Files)
                 .FirstOrDefaultAsync(s => s.Id == id);
        }
        public Task<FileHolder> GetFileByIdAsync(int id)
        {
            return _dbContext.Files
                 .FirstOrDefaultAsync(s => s.Id == id);
        }

        public Task<List<Folder>> GetFolders()
        {
            return _dbContext.Folders
                .Include(folder => folder.Files)
                .ToListAsync();
        }

        public Task<List<Folder>> ListAsync()
        {
            return _dbContext.Folders
                .Include(folder => folder.Files)
                .ToListAsync();
        }

        public Task RemoveFolderAsync(Folder folder)
        {
            _dbContext.Folders.Remove(folder);
            return _dbContext.SaveChangesAsync();
        }
        public Task RemoveFileAsync(FileHolder file)
        {
            _dbContext.Files.Remove(file);
            return _dbContext.SaveChangesAsync();
        }
        public DatabaseFacade GetDatabase()
        {
            return _dbContext.Database;
        }

        public Task<User> GetUserByData(string password, string name)
        {
            return _dbContext.Users
                .SingleOrDefaultAsync(x => x.Username == name && x.Password == password);
        }
        public Task<User> GetUserByData(int id)
        {
            return _dbContext.Users
                 .FirstOrDefaultAsync(s => s.Id == id);
        }
        public Task<List<User>> GetUsers()
        {
            return _dbContext.Users
                .ToListAsync();
        }
        public Task UpdateUserTokensAsync(int id, string accessToken, string refreshToken)
        {
            var actualUser = _dbContext.Users
                 .FirstOrDefault(s => s.Id == id);
            actualUser.RefreshToken = refreshToken;
            actualUser.RequestToken = accessToken;

            return _dbContext.SaveChangesAsync();

        }

        public Task UpdateLoginStateAsync(int user, bool login)
        {
            var actualUser = _dbContext.Users
                  .FirstOrDefault(s => s.Id == user);

            actualUser.LoggedIn = login;
            return _dbContext.SaveChangesAsync();
        }

        public Task UpdateLoginStateAsync(string token, bool login)
        {
            var actualUser = _dbContext.Users
                  .FirstOrDefault(s => s.RequestToken == token);

            actualUser.LoggedIn = login;
            return _dbContext.SaveChangesAsync();
        }
    }
}
