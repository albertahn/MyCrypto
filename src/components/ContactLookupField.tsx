import React, { useContext } from 'react';

import { Network, IReceiverAddress, ErrorObject } from '@types';
import {
  AddressBookContext,
  findNextRecipientLabel,
} from '@services/Store';

import GenericLookupField from './GenericLookupField';

interface IContactLookupFieldComponentProps {
  error?: string | ErrorObject;
  network: Network;
  isResolvingName: boolean;
  name: string;
  value: IReceiverAddress;
  onBlur?(): void;
  setIsResolvingDomain(isResolving: boolean): void;
}

const ContactLookupField = ({
  network,
  name,
  value
}: IContactLookupFieldComponentProps) => {
  const {
    addressBook: contacts,
    createAddressBooks: createContact,
    getContactByAddress
  } = useContext(AddressBookContext);

  const handleEthAddress = (inputString: string): IReceiverAddress => {
    const contact = getContactByAddress(inputString);
    if (contact) return { display: contact.label, value: contact.address };

    const label = findNextRecipientLabel(contacts);
    createContact({
      address: inputString,
      label,
      notes: '',
      network: network.id
    });
    return {
      display: label,
      value: inputString
    };
  };

  const handleENSname = (resolvedAddress: string, inputString: string) => {
    const contact = getContactByAddress(resolvedAddress);
    if (contact) return { display: contact.label, value: contact.address };

    const [label] = inputString.split('.');
    createContact({
      address: resolvedAddress,
      label,
      notes: '',
      network: network.id
    });
    return {
      display: label,
      value: resolvedAddress
    };
  };

  return (
    <GenericLookupField
      name={name}
      value={value}
      network={network}
      options={contacts}
      handleEthAddress={handleEthAddress}
      handleENSname={handleENSname}
    />
  );

  /**useEffectOnce(() => {
          if (value && value.value) {
            const contact = getContactByAddress(value.value);
            if (contact && value.display !== contact.label) {
              form.setFieldValue(name, { display: contact.label, value: contact.address }, true);
            }
          }
        });**/
};

export default ContactLookupField;
