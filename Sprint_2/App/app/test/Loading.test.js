import React from 'react';
import { render, screen } from '@testing-library/react';
import Loading from '../components/Loading.js'; 

describe('Loading component', () => {
  it('renders the loading message and animation', () => {
    render(<Loading />);

  
    const heading = screen.getByRole('heading', { name: /loading/i });
    expect(heading).not.toBeNull(); 

    
    const description = screen.getByText(/please wait a moment/i);
    expect(description).not.toBeNull(); 


  });
});
