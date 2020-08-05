using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReactTestApp.Models
{
    public class Folder
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<FileHolder> Files { get; set; }
    }
}
