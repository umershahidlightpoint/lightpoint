﻿// <auto-generated />
//
// To parse this JSON data, add NuGet 'Newtonsoft.Json' then do:
//
//    using LedgersIdType;
//
//    var singleLedgerProps = SingleLedgerProps.FromJson(jsonString);

namespace LedgersIdType
{
    using System;
    using System.Collections.Generic;

    using System.Globalization;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Converters;

    public partial class SingleLedgerProps
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("value")]
        public int Value { get; set; }

        [JsonProperty("effectiveDate")]
        public DateTimeOffset EffectiveDate { get; set; }

        [JsonProperty("fund")]
        public Account Fund { get; set; }

        [JsonProperty("account")]
        public Account Account { get; set; }

        [JsonProperty("accountType")]
        public Account AccountType { get; set; }

        [JsonProperty("customer")]
        public Account Customer { get; set; }
    }

    public partial class Account
    {
        [JsonProperty("id")]
        public long Id { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }

    public partial class SingleLedgerProps
    {
        public static SingleLedgerProps FromJson(string json) => JsonConvert.DeserializeObject<SingleLedgerProps>(json, LedgersIdType.Converter.Settings);
    }

    public static class Serialize
    {
        public static string ToJson(this SingleLedgerProps self) => JsonConvert.SerializeObject(self, LedgersIdType.Converter.Settings);
    }

    internal static class Converter
    {
        public static readonly JsonSerializerSettings Settings = new JsonSerializerSettings
        {
            MetadataPropertyHandling = MetadataPropertyHandling.Ignore,
            DateParseHandling = DateParseHandling.None,
            Converters =
            {
                new IsoDateTimeConverter { DateTimeStyles = DateTimeStyles.AssumeUniversal }
            },
        };
    }
}
