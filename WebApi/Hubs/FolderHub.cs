using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using FolderProjectApp.Models;
using FolderProjectApp.Models.AuthModel;
using FolderProjectApp.Services.Interfaces;

namespace FolderProjectApp.Hubs
{
    public class FolderHub : Hub
    {
        private static int UsersCount { get; set; } = 0;

        private readonly IEFFileFolderContext db;
        public FolderHub(IEFFileFolderContext context)
        {
            db = context;
        }
        public override async Task OnConnectedAsync()
        {
            UsersCount++;
            string token = GetToken(Context.GetHttpContext());

            await db.UpdateLoginStateAsync(token, true);
            //var z = Context.ConnectionId;

            if (UsersCount >= 3)
            {
                await Clients.Caller.SendAsync("Overload");
            }
            else
            {
                await Clients.Caller.SendAsync("ConnectionSuccessful");
                await Clients.All.SendAsync("DataUpdate");
            }
            await base.OnConnectedAsync();

        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            UsersCount--;
            string token = GetToken(Context.GetHttpContext());
            await Clients.Caller.SendAsync("Disconnection");
            await db.UpdateLoginStateAsync(token, false);

            Context.Abort();
            await base.OnDisconnectedAsync(exception);
        }


        private string GetToken(HttpContext context)
        {
            string token = context.Request.Query["Token"].ToList()[0];
            return token[1..^1];
        }
    }
}
