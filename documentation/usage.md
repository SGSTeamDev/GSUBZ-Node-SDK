# Usage Guide

## Response Structure

All API responses follow this structure:

```json
{
  "code": 200,
  "status": "TRANSACTION_SUCCESSFUL",
  "description": "Description of the response",
  "data": { ... }  // This can be undefined
}
```

## Response Codes

| Code | Description                                                                                                |
| ---- | ---------------------------------------------------------------------------------------------------------- |
| 200  | TRANSACTION_SUCCESSFUL (Note: A transaction can fail and still return 200, but with `"status": "failed"`.) |
| 204  | REQUIRED_CONTENT_NOT_SENT                                                                                  |
| 206  | INVALID_CONTENT                                                                                            |
| 401  | AUTHORIZATION_FAILED                                                                                       |
| 400  | FAILED                                                                                                     |
| 402  | ERROR_IN_PAYMENT                                                                                           |
| 404  | CONTENT_NOT_FOUND                                                                                          |
| 405  | REQUEST_METHOD_NOT_IN_POST                                                                                 |
| 406  | NOT_ALLOWED                                                                                                |
| 500  | API_ERROR                                                                                                  |
| 502  | GATEWAY_ERROR                                                                                              |

## Errors

Failed requests reject with an `AppError` containing the same public fields as a response:

```json
{
  "code": 400,
  "status": "failed",
  "description": "Description of the failure",
  "data": { ... } // Optional provider details
}
```

The SDK validates required inputs before calling GSUBZ. `pay` requires `serviceID`, `verifyPay` requires `requestID` or `transactionID`, and `plans`/`service` require `service`. Provider diagnostics are preserved but bounded and redacted so credentials, tokens, and long identifiers are not exposed in error messages.

Requests use realistic timeouts: purchases (`pay`) allow 10 minutes, while balance, plans, service details, and verification allow 15 seconds.

## Available Methods

### 1. Balance

Retrieves your account balance.

```javascript
const getBalance = async () => {
  try {
    const response = await gsubz.balance();
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```

### 2. Plans

Fetches available plans for a specific service. The `service` value should be the `serviceID`.

```javascript
const getDataPlans = async () => {
  try {
    const response = await gsubz.plans({ service: "gotv" });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```

### 3. Service

Gets details of a specific service.

```javascript
const getService = async () => {
  try {
    const response = await gsubz.service({ service: "mtn" });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```

### 4. Pay

Processes a payment for a service. `serviceID` is required. See [POSTMAN Collection](https://documenter.getpostman.com/view/16767782/UyxhnnZz) for detailed payload structures for other services.

```javascript
const buyData = async () => {
  try {
    const response = await gsubz.pay({
      serviceID: "mtn_sme",
      plan: 179,
      phone: "+2348168643908",
      amount: "",
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};

const buyAirtime = async () => {
  try {
    const response = await gsubz.pay({
      serviceID: "mtn",
      phone: "+2348160381840",
      amount: 100,
    });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```

### 5. Verify Pay

Verifies the status of a payment. Send the `requestID` you supplied when buying, or the `transactionID` returned by the purchase. You need at least one of them.

```javascript
const verifyPay = async () => {
  try {
    const response = await gsubz.verifyPay({ requestID: "SPY-abc123" });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```

```javascript
const verifyPayByTransactionId = async () => {
  try {
    const response = await gsubz.verifyPay({ transactionID: "3574357094" });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```

### POSTMAN Collection

https://documenter.getpostman.com/view/16767782/UyxhnnZz
