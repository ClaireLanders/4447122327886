import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FormField from '../components/ui/form-field';

describe('FormField', () => {
  it('renders the label and fires onChangeText', () => {
    const onChangeTextMock = jest.fn();
    const { getByText, getByLabelText, getByPlaceholderText} = render(
      <FormField label="Name" value="" onChangeText={onChangeTextMock} placeholder="Enter your name" />
    );

    expect(getByText('Name')).toBeTruthy();
    expect(getByLabelText('Name')).toBeTruthy();
    expect(getByPlaceholderText('Enter your name')).toBeTruthy();

    fireEvent.changeText(getByLabelText('Name'), 'Alice');
    expect(onChangeTextMock).toHaveBeenCalledWith('Alice');
  });
});