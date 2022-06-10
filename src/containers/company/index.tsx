import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { companies, numbers } from '~services';
import { ContainerHeader, Table } from '~components';
import { useIdParam } from '~hooks';
import { FormatNumberId } from '~utils';
import * as Styled from './style';

function Company() {
  const [numberArray, setNumberArray] = useState([]);
  const companyId = useIdParam();

  const {
    isLoading: isLoadingCompany,
    error: ErrorCompany,
    data: DataCompany,
  } = useQuery(`fetchCompany${companyId}`, () => companies.fetchOne(companyId), {
    refetchOnWindowFocus: false,
    retry: false,
  });

  const {
    isLoading: isLoadingNumbers,
    error: ErrorNumbers,
    data: DataNumbers,
  } = useQuery('fetchNumbers', numbers.fetchAll, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  useEffect(() => {
    if (DataNumbers && DataCompany)
      setNumberArray(DataNumbers?.filter((item) => item.company_id === DataCompany?.id));
  }, [DataNumbers, DataCompany]);

  return (
    <Styled.Container>
      <ContainerHeader title={DataCompany?.name} needsBackButton />
      <Styled.Content>
        <Table titles={['Number', 'Type']} isLoading={isLoadingCompany || isLoadingNumbers}>
          {numberArray?.map((number) => (
            <tr key={number.id}>
              <td>
                <Link to={`/number/${number.id}`}>{number.id && FormatNumberId(number.id)}</Link>
              </td>
              <td>{number.type}</td>
            </tr>
          ))}
        </Table>
      </Styled.Content>
    </Styled.Container>
  );
}

export default Company;
