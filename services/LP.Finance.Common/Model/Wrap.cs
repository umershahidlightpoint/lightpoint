﻿namespace LP.Finance.Common.Models
{
    public class Wrap<T> where T : class
    {
        public string When { get; set; }
        public string By { get; set; }
        public T[] Data { get; set; }
    }
}