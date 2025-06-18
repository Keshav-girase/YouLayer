/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from './ui/spinner';
import toast from 'react-hot-toast';

const CreatorsList = ({ selectedCreator, setSelectedCreator, label }) => {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('/manager/creators', {
          headers: {
            Authorization: `${token}`,
          },
        });
        setCreators(res.data.creators);
      } catch (err) {
        toast.error(`${err.message}` || 'Failed to fetch creators');
        // console.error('Failed to fetch creators:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, []);

  return (
    <div className="w-full ">
      <div className="flex flex-col space-y-2">
        {label}
        <Select value={selectedCreator} onValueChange={setSelectedCreator}>
          <SelectTrigger id="creator" className="w-full">
            <SelectValue placeholder="Choose a creator" />
          </SelectTrigger>
          <SelectContent>
            {loading ? (
              <div className="flex justify-center items-center p-4">
                <Spinner size="sm" className="bg-foreground" />
              </div>
            ) : (
              creators.map(creator => (
                <SelectItem key={creator._id} value={creator._id}>
                  <div className="flex flex-col justify-start items-start">
                    <span className="font-medium ">{creator.name} </span>
                    <span className="text-xs text-muted-foreground ml">{creator.teamName}</span>
                  </div>
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CreatorsList;
