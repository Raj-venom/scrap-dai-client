import { useCallback, useEffect, useState } from "react";


const useFetch = (fn: (() => Promise<any>) ) => {
    console.log("first", fn)
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fn();
            setData(response);
        } catch (error: any) {
            setError(error.message);
        } finally {
            setLoading(false);
        }

    };



    useEffect(() => {
        fetchData();
    }, [fn]); 

    const refetch = () => fetchData();

    return { data, loading, error, refetch };

};

export default useFetch;