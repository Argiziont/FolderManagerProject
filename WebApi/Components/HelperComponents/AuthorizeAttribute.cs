using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using FolderProjectApp.Models.AuthModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace FolderProjectApp.Components.HelperComponents
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizeAttribute : Attribute, IAuthorizationFilter
    {
        public string Roles { get; set; }
        public AuthorizeAttribute(string role) : base()
        {
            Roles = role;
        }
        public AuthorizeAttribute() : base()
        { }
        public  void OnAuthorization(AuthorizationFilterContext context)
        {
            if (!(context.HttpContext.Items[nameof(User)] is Task<User> userTask))
            {
                // not logged in

                context.Result = new JsonResult(new { StatusText = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }
            else
            {
                userTask.Wait();
                User user = userTask.Result;
                if (user.Role != null && Roles != null)
                {
                    if (user.Role != "Admin" && user.Role != Roles)
                    {
                        context.Result = new JsonResult(new { StatusText = "Permission denied" }) { StatusCode = StatusCodes.Status401Unauthorized };
                    }
                }
            }
        }
    }
}
