import React from 'react';
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
  margin-bottom: 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

interface GridTradingParamsProps {
  formData: {
    upperPrice: string;
    lowerPrice: string;
    gridLevels: string;
    gridSpacing: string;
    orderSize: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: Record<string, string>;
}

const GridTradingParams: React.FC<GridTradingParamsProps> = ({ formData, onChange, errors = {} }) => {
  const validatePriceRelationship = (value: string, fieldName: string) => {
    const numberError = validateNumber(value, { required: true, min: 0 });
    if (numberError) return numberError;

    const currentValue = parseFloat(value);
    const upperPrice = parseFloat(formData.upperPrice);
    const lowerPrice = parseFloat(formData.lowerPrice);

    if (fieldName === 'upperPrice' && currentValue <= lowerPrice) {
      return 'Upper price must be greater than lower price';
    }
    if (fieldName === 'lowerPrice' && currentValue >= upperPrice) {
      return 'Lower price must be less than upper price';
    }
    if (currentValue <= 0) {
      return 'Price must be greater than 0';
    }
    return '';
  };

  const validateGridLevels = (value: string) => {
    const numberError = validateNumber(value, { required: true, min: 2, max: 100, integer: true });
    if (numberError) return numberError;
    return '';
  };

  const validateGridSpacing = (value: string) => {
    const numberError = validateNumber(value, { required: true, min: 0.1, max: 100 });
    if (numberError) return numberError;
    const spacing = parseFloat(value);
    if (spacing > 20) {
      return 'Grid spacing should not exceed 20%';
    }
    return '';
  };

  const validateOrderSize = (value: string) => {
    const numberError = validateNumber(value, { required: true, min: 0.00000001 });
    if (numberError) return numberError;
    return '';
  };

  return (
    <StyledSection>
      <SectionTitle>Grid Trading Parameters</SectionTitle>
      <Grid>
        <FormGroup
          label="Upper Price"
          tooltip={tooltips.upperPrice}
          error={errors.upperPrice}
        >
          <Input
            type="number"
            id="upperPrice"
            name="upperPrice"
            value={formData.upperPrice}
            onChange={onChange}
            hasError={!!errors.upperPrice}
            min="0"
            step="0.00000001"
            aria-label="Upper Price"
            validate={(value) => validatePriceRelationship(value, 'upperPrice')}
          />
        </FormGroup>

        <FormGroup
          label="Lower Price"
          tooltip={tooltips.lowerPrice}
          error={errors.lowerPrice}
        >
          <Input
            type="number"
            id="lowerPrice"
            name="lowerPrice"
            value={formData.lowerPrice}
            onChange={onChange}
            hasError={!!errors.lowerPrice}
            min="0"
            step="0.00000001"
            aria-label="Lower Price"
            validate={(value) => validatePriceRelationship(value, 'lowerPrice')}
          />
        </FormGroup>

        <FormGroup
          label="Grid Levels"
          tooltip={tooltips.gridLevels}
          error={errors.gridLevels}
        >
          <Input
            type="number"
            id="gridLevels"
            name="gridLevels"
            value={formData.gridLevels}
            onChange={onChange}
            hasError={!!errors.gridLevels}
            min="2"
            step="1"
            validate={validateGridLevels}
            aria-label="Number of Grid Levels"
          />
        </FormGroup>

        <FormGroup
          label="Grid Spacing (%)"
          tooltip={tooltips.gridSpacing}
          error={errors.gridSpacing}
        >
          <Input
            type="number"
            id="gridSpacing"
            name="gridSpacing"
            value={formData.gridSpacing}
            onChange={onChange}
            hasError={!!errors.gridSpacing}
            min="0.1"
            step="0.1"
            aria-label="Grid Spacing Percentage"
            validate={validateGridSpacing}
          />
        </FormGroup>
      </Grid>

      <Grid>
        <FormGroup
        label="Order Size"
        tooltip={tooltips.orderSize}
        error={errors.orderSize}
      >
        <Input
          type="number"
          id="orderSize"
          name="orderSize"
          value={formData.orderSize}
          onChange={onChange}
          hasError={!!errors.orderSize}
          min="0"
          step="0.00000001"
          aria-label="Order Size"
          validate={validateOrderSize}
        />
      </FormGroup>
      </Grid>
    </StyledSection>
  );
};

export default GridTradingParams;
