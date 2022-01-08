/* global BigInt */
import {
  useEffect,
  useState,
} from 'react';

import {
  Box,
  CircularProgress,
  Typography,
} from '@mui/material';

const getTotalBalanceOfAddress = async (address) => {
    const response = await fetch('https://mynano.ninja/api/node', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            action: 'account_balance',
            account: address,
        }),
    });
    const json = await response.json();
    const balanceRaw = BigInt(json.balance);
    const pendingRaw = BigInt(json.pending);
    const totalRaw = balanceRaw + pendingRaw;
    const totalNano = Number(BigInt(totalRaw)/BigInt(1e20))/1e10;
    return totalNano;
}

function BalanceMonitor({ address }) {
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const updateBalance = () => {
            getTotalBalanceOfAddress(address).then(setBalance);
        };
        const interval = setInterval(updateBalance, 5000);
        updateBalance();
        return () => clearInterval(interval);
      }, []);
    
    if (balance === null) {
        return (
            <Box sx={{textAlign: "center"}}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <Typography sx={{textAlign: "center"}}>
            Your account currently has a balance of {balance} nano.
        </Typography>
    );
}

export default BalanceMonitor;