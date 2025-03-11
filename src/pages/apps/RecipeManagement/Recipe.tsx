import React, { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useRedux } from '../../../hooks';
import { recipeIngredientList, recipeIngredientAdd } from '../../../redux/actions';

const Recipe = () => {
    const { dispatch, appSelector } = useRedux();
    const location = useLocation();
    const business_id = location.state?.business_id;
    console.log('id', business_id);

    useEffect(() => {
        // console.log('RECIPE HERE');
        // const outlet_id = '5c35b4c2-87f6-4f36-99cf-cdf33804e2ce';
        const name = 'hello74827428';
        dispatch(recipeIngredientList(business_id));
        dispatch(recipeIngredientAdd(name, business_id));
    }, [dispatch]);
    return <div>RECIPE</div>;
};

export default Recipe;
