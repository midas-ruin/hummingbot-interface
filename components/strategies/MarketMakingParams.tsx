import styled from 'styled-components';
import { FormGroup, Input } from '../common/FormElements';
import { validateNumber, tooltips } from '../../utils/validation';

const StyledSection = styled.section`
  margin-top: 1.5rem;
  padding: 1.5rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
`;

const SectionTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

interface MarketMakingParamsProps {
  formData: {
    bidSpread: string;
    askSpread: string;
    orderAmount: string;
    orderInterval: string;
    minProfitability: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
}

const MarketMakingParams: React.FC<MarketMakingParamsProps> = ({ formData, onChange, errors = {} }) => {
  const validateSpread = (value: string) => {
    const error = validateNumber(value, { required: true, min: 0, max: 100 });
    if (error) return error;
    const num = parseFloat(value);
    if (num > 5) return 'Spread should not exceed 5%';
    return '';
  };

  const validateOrderAmount = (value: string) => {
    return validateNumber(value, { required: true, min: 0.00000001 });
  };

  const validateOrderInterval = (value: string) => {
    return validateNumber(value, { required: true, min: 1, max: 3600, integer: true });
  };

  const validateProfitability = (value: string) => {
    const error = validateNumber(value, { required: true, min: 0, max: 100 });
    if (error) return error;
    const num = parseFloat(value);
    if (num > 20) return 'Profitability target should not exceed 20%';
    return '';
  };

  return (
    <StyledSection>
      <SectionTitle>Market Making Parameters</SectionTitle>
      <FormGroup
        label="Bid Spread (%)"
        tooltip={tooltips.bidSpread}
        error={errors.bidSpread}
      >
        <Input
          type="number"
          id="bidSpread"
          name="bidSpread"
          value={formData.bidSpread}
          onChange={onChange}
          validate={validateProfitability}
          min="0"
          step="0.1"
          hasError={!!errors.bidSpread}
        />
      </FormGroup>

      <FormGroup
        label="Ask Spread (%)"
        tooltip={tooltips.askSpread}
        error={errors.askSpread}
      >
        <Input
          type="number"
          id="askSpread"
          name="askSpread"
          value={formData.askSpread}
          onChange={onChange}
          validate={validateOrderAmount}
          min="0.00000001"
          step="0.00000001"
          hasError={!!errors.orderAmount}
        />
      </FormGroup>

      <FormGroup
        label="Order Amount"
        tooltip={tooltips.orderAmount}
        error={errors.orderAmount}
      >
        <Input
          type="number"
          id="orderAmount"
          name="orderAmount"
          value={formData.orderAmount}
          onChange={onChange}
          hasError={!!errors.orderAmount}
          min="0"
          step="0.00000001"
          validate={validateSpread}
        />
      </FormGroup>

      <FormGroup
        label="Order Interval (seconds)"
        tooltip={tooltips.orderInterval}
        error={errors.orderInterval}
      >
        <Input
          type="number"
          id="orderInterval"
          name="orderInterval"
          value={formData.orderInterval}
          onChange={onChange}
          hasError={!!errors.orderInterval}
          min="1"
          step="1"
          validate={validateOrderInterval}
        />
      </FormGroup>

      <FormGroup
        label="Minimum Profitability (%)"
        tooltip={tooltips.minProfitability}
        error={errors.minProfitability}
      >
        <Input
          type="number"
          id="minProfitability"
          name="minProfitability"
          value={formData.minProfitability}
          onChange={onChange}
          hasError={!!errors.minProfitability}
          min="0"
          step="0.1"
          validate={validateSpread}
        />
      </FormGroup>
    </StyledSection>
  );
};

export default MarketMakingParams;
