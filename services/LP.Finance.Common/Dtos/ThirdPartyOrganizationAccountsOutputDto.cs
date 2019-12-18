using System.Collections.Generic;

namespace LP.Finance.Common.Dtos
{
    public class ThirdPartyOrganizationAccountsOutputDto
    {
        public int? OrganizationId { get; set; }
        public string OrganizationName { get; set; }
        public List<ThirdPartyAccountsOutputDto> Accounts { get; set; }
    }
}