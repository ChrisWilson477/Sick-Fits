import { useState, useEffect } from 'react';

export default function useForm(initial = {}) {
  // create a state object for our inputs

  const [inputs, setInputs] = useState(initial);
  const initialValues = Object.values(initial).join('');

  useEffect(() => {
    setInputs(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  function handleChange(e) {
    let { value, type, name } = e.target;
    if (type === 'number') {
      value = parseInt(value);
    }
    if (type === 'file') {
      [value] = e.target.files;
    }
    console.log(inputs);
    setInputs({
      ...inputs,
      [name]: value,
    });
  }

  function resetForm() {
    setInputs(initial);
  }

  function clearForm() {
    const blankState = Object.fromEntries(
      Object.entries(inputs).map(([key, value]) => [key, ''])
    );
    console.log(blankState);
    setInputs(blankState);
  }

  return {
    inputs,
    handleChange,
    resetForm,
    clearForm,
  };
}
