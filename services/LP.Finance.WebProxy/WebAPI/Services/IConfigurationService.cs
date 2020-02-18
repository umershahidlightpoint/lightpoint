﻿using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface IConfigurationService
    {
        object GetConfigurations(string project);
        object AddConfig(List<ConfigurationInputDto> obj);
        object UpdateConfig(List<ConfigurationInputDto> obj);
    }
}