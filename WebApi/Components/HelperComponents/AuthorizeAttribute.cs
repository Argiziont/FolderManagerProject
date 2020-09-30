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
        private string[] userRoles { get; set; }
        public AuthorizeAttribute(params string[] roles)
        {
            userRoles = roles;
        }
        public AuthorizeAttribute()
        { }
        public void OnAuthorization(AuthorizationFilterContext context)
        {
            var user = (User)context.HttpContext.Items[nameof(User)];
            if (user == null)
            {
                // not logged in

                context.Result = new JsonResult(new { StatusText = "Unauthorized" }) { StatusCode = StatusCodes.Status401Unauthorized };
            }
            else if (user.Role != null&& userRoles!=null)
            {
                //Role check
                var results= Array.FindAll(userRoles, s => s.Equals(user.Role));
                 
                if (results.Length==0)
                {
                    context.Result = new JsonResult(new { StatusText = "Permission denied" }) { StatusCode = StatusCodes.Status401Unauthorized };
                }

            }
        }


    }
}
