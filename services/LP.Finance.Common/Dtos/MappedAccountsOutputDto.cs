namespace LP.Finance.Common.Dtos
{
    public class MappedAccountsOutputDto
    {
        public int? MapId { get; set; }
        public int ThirdPartyAccountId { get; set; }
        public string ThirdPartyAccountName { get; set; }
        public string OrganizationName { get; set; }
    }
}