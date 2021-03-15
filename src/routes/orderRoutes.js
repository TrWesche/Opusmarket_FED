import OrderDetails from "../components/Order/OrderDetails";
import OrderHome from "../components/Order/OrderHome";

import {
    ORDER_DETAILS_PATH, 
    ORDER_HISTORY_PATH } from './_pathDict';

const OrderRoutes = [
    {
        'component': OrderHome,
        'path': ORDER_HISTORY_PATH,
        'exact': false
    },
    {
        'component': OrderDetails,
        'path': ORDER_DETAILS_PATH,
        'exact': true
    }
];

export default OrderRoutes;