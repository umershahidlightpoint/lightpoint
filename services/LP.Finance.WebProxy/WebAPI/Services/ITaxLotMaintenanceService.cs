using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface ITaxLotMaintenanceService
    {
        object ReverseTaxLotAlleviation(TaxLotReversalDto obj);
        object AlleviateTaxLot(AlleviateTaxLotDto obj);
    }
}
