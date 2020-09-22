using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.SignalR;
using ReactTestApp.Models;
using ReactTestApp.Models.AuthModel;

namespace ReactTestApp.Hubs
{
    public class FolderHub : Hub
    {
        private static int usersCount { get; set; } = 0;

        private ApplicationDbContext db;
        public FolderHub( ApplicationDbContext context)
        {
            db = context;
        }
        public override async Task OnConnectedAsync()
        {
            usersCount++;
        
            if (usersCount >= 6)
            {
                await Clients.Caller.SendAsync("Overload", $"{Context.ConnectionId} вошел (Чат переполнен). Всего: {usersCount}");
            }
            else
            {
                string token= getToken( Context.GetHttpContext());

                User user = db.Users.SingleOrDefault(x => x.RequestToken == token);
                user.LoggedIn = true;
                db.SaveChanges();

                await Clients.All.SendAsync("Notify", $"{Context.ConnectionId} вошел . Всего: {usersCount}");
            }
            await base.OnConnectedAsync();
        }
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            usersCount--;
            string token = getToken(Context.GetHttpContext());

            User user = db.Users.SingleOrDefault(x => x.RequestToken == token);
            user.LoggedIn = false;
            db.SaveChanges();

            await Clients.All.SendAsync("Notify", $"{Context.ConnectionId} покинул нас. Всего: {usersCount}");
            Context.Abort();
            await base.OnDisconnectedAsync(exception);
        }

        private string getToken(HttpContext context)
        {
            string token = context.Request.Query["Token"].ToList()[0];
            return token.Substring(1, token.Length - 2);
        }
    }
}
