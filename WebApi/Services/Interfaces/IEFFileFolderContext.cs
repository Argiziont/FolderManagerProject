using FolderProjectApp.Models;
using FolderProjectApp.Models.AuthModel;
using Microsoft.EntityFrameworkCore.Infrastructure;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FolderProjectApp.Services.Interfaces
{
    public interface IEFFileFolderContext
    {
        //Folder Actions
        public Task<Folder> GetFolderByIdAsync(int id);
        public Task<List<Folder>> GetFolders();
        public Task AddFolderAsync(Folder folder);
        public Task RemoveFolderAsync(Folder folder);
        public Task<List<Folder>> ListAsync();

        //File Actions

        public Task<FileHolder> GetFileByIdAsync(int id);
        public Task AddFileAsync(FileHolder file);
        public Task RemoveFileAsync(FileHolder file);

        //User Actions
        public Task<User> GetUserByData(string password, string name);
        public Task<User> GetUserByData(int id);
        public Task<List<User>> GetUsers();
        public Task UpdateUserTokensAsync(int user, string accessToken, string refreshToken);
        public Task UpdateLoginStateAsync(int user, bool login);
        public Task UpdateLoginStateAsync(string token, bool login);

        //Database Actions
        public DatabaseFacade GetDatabase();
    }
}
