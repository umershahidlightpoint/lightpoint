using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface ISecurityService
    {
        object GetSecurityConfig(string symbol);
        object GetAllConfig(string securityType);
        object GetSecurityDetails();
        object GetSecurityDetail(string symbol);
        object AddSecurityDetails(SecurityDetailsInputDto details);
        object EditSecurityDetails(SecurityDetailsInputDto details);
        object DeleteSecurityDetail(int id);
        object GetSecurityType();

    }
}
