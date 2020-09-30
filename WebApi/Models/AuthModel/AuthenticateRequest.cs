using System.ComponentModel.DataAnnotations;

namespace FolderProjectApp.Models.AuthModel
{
    public class AuthenticateRequest
    {
        [Required]
        public string Username { get; set; }
        [Required]
        public string Password { get; set; }
        public bool LoggedIn { get; set; }
    }
}
