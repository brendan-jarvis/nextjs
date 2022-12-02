import React from 'react';
import { useQuery } from 'react-query';
import dotenv from 'dotenv';

dotenv.config();

const fetchData = async () => {
  const response = await fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_SECRET}`,
    },
    body: JSON.stringify({
      prompt: 'Hello world!',
      model: 'text-davinci-002',
      temperature: 0.5
    }),
  });
  return response.json();
}

const MyComponent = () => {
  const { data, isLoading, error } = useQuery('data', fetchData);

  if (isLoading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }

  return (
    <div>
      <h1>My Data</h1>
      {data.map(item => (
        <p key={item.id}>{item.name}</p>
      ))}
    </div>
  );
};

export default MyComponent;
