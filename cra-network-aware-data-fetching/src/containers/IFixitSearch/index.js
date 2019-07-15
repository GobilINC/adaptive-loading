/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useState } from 'react';

import './ifixit-search.css';
import SearchBar from '../../components/SearchBar';
import List from '../../components/List';
import Spinner from '../../components/Spinner';
import { useConnectionEffectiveType } from '../../utils/hooks';

const IFixitSearch = () => {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const connectionEffectiveType = useConnectionEffectiveType();
  let searchLimit;
  switch(connectionEffectiveType) {
    // case 'offline':
    //   break;
    case 'slow-2g':
    case '2g':
      searchLimit = 5;
      break;
    case '3g':
      searchLimit = 15;
      break;
    case '4g':
      searchLimit = 40;
      break;
    default:
      searchLimit = 40;
      break;
  }

  const searchHandler = searchKey => {
    if (!searchKey) return;
    
    setLoading(true);
    const endpoint = `https://www.ifixit.com/api/2.0/search/${searchKey}?limit=${searchLimit}`;

    fetch(endpoint)
      .then(response => response.json())
      .then(response => {
        setLoading(false);
        setSearchResults(response.results);
      })
      .catch(error => {
        setLoading(false);
        console.error('Error: ', error)
      });
  };

  return (
    <div className='ifixit-search'>
      <div className='ifixit-search-status-panel'>
        <p>{`Current effective network connection: ${connectionEffectiveType}`}</p>
        <p>Number of results on effective network connection:</p>
        <p>4G: 40 results, 3G: 15 results, 2G: 5 results, slow-2g: 5 results</p>
      </div>
      <SearchBar search={searchHandler} />
      { loading ? (
        <Spinner />
      ) : (
        <List items={searchResults} />
      ) }
    </div>
  )
};

export default IFixitSearch;
