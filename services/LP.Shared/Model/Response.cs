using System;

namespace LP.Shared.Model
{
    public class Response
    {
        public DateTime when { get; set; }
        public string by { get; set; }
        public bool isSuccessful { get; set; }
        public string message { get; set; }
        public object payload { get; set; }
        public object meta { get; set; }
        public object stats { get; set; }
        public object statusCode { get; set; }
    }
}