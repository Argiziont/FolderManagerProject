using System.Text.Json.Serialization;

namespace FolderProjectApp.Models.AuthModel
{
    public class User
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
        public bool LoggedIn { get; set; } = false;
        public string RequestToken { get; set; }
        public string RefreshToken { get; set; }

    }
}
