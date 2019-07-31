using System.Collections.Generic;

namespace LP.Finance.Common.Dtos
{
    public class AccountDefOutputDto
    {
        public int? AccountDefId { get; set; }
        public int? AccountCategoryId { get; set; }
        public List<AccountDefTagOutputDto> AccountTags { get; set; }
    }
}