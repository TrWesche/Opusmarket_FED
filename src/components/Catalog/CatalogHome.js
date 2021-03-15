import React, { useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { 
    Container, 
    Grid
    } from "@material-ui/core";
import HeroStepper from "../Common/Hero/HeroStepper";
import ProductGrid from "../../components/Common/CardList/ProductGrid";
import CatalogFilter from "../Common/CardFilter/CatalogFilter";

import { makeStyles } from '@material-ui/core/styles';
import { fetchCatalogProducts } from "../../actions/actionsProductCatalog";


const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '2rem'
    },
    vSection: {
        flexGrow: 1,
    }
}));

function Catalog() {
    // const theme = useTheme();
    const classes = useStyles();
    const location = useLocation();
    const dispatch = useDispatch();

    // Retrieve search parameters from compiled query string
    // https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams
    const searchParams = new URLSearchParams(location.search);
    
    // Link up to Redux productCatalog store
    const productCatalog = useSelector(store => store.productCatalog);
    // const error = useSelector(store => store.error);

    // Build query list for API call
    let catalogSearchParameters = {};
    const updateQueryParams = useCallback(() => {
        catalogSearchParameters = {};
        for (const [key, value] of searchParams) {
            catalogSearchParameters[key] = value;
        }
    }, [location.search]);

    // Update search results on changes to the query list
    useEffect(() => {
        updateQueryParams();
        dispatch(fetchCatalogProducts({searchParameters: catalogSearchParameters, searchType: "catalog"}));
    }, [dispatch, updateQueryParams]);


    const renderResults = () => {
        if (productCatalog.queryProducts && productCatalog.queryProducts.length > 0) {
            return (
                <Grid container className={classes.vSection} spacing={2}>
                    <Grid item xs={12} md={3}>
                        <CatalogFilter 
                            featuredProducts={productCatalog.queryFeatures}
                            productMetas={productCatalog.queryMetas}
                        />
                    </Grid>
                    <Grid item xs={12} md={9}>
                        <ProductGrid productDataList={productCatalog.queryProducts} listid={"browse-catalog"} />
                    </Grid>
                </Grid>
            )
        } else {
            <Grid container className={classes.vSection} spacing={2}>
                <Grid item xs={12}>
                    <p>No results found for this search.</p>
                </Grid>
            </Grid>
        }
    }


    return (
        <Container className={classes.root}>
            <Grid container className={classes.vSection} spacing={2}>
                <Grid item xs={12}>
                    <HeroStepper />
                </Grid>
            </Grid>
            {renderResults()}
        </Container>
    );
}

export default Catalog;