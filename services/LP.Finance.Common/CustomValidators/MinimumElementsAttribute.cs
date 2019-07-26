using System.Collections;
using System.ComponentModel.DataAnnotations;

namespace LP.Finance.Common.CustomValidators
{
    class MinimumElementsAttribute : ValidationAttribute
    {
        private readonly int _minimumElements;

        public MinimumElementsAttribute(int minimumElements)
        {
            this._minimumElements = minimumElements;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var list = value as IList;

            var result = list?.Count >= _minimumElements;

            return result
                ? ValidationResult.Success
                : new ValidationResult($"{validationContext.DisplayName} require at least {_minimumElements} element" +
                                       (_minimumElements > 1 ? "s" : string.Empty));
        }
    }
}