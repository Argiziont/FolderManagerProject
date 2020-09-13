using System.Text.Json.Serialization;

namespace ReactTestApp.Models.AuthModel
{
    public class User
    {
        public int Id { get; set; }
        public string Role { get; set; }
        public string Username { get; set; }
        public string Name { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
    }
}
