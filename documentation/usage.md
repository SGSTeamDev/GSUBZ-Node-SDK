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
| 402  | ERROR_IN_PAYMENT                                                                                           |
| 404  | CONTENT_NOT_FOUND                                                                                          |
| 405  | REQUEST_METHOD_NOT_IN_POST                                                                                 |
| 406  | NOT_ALLOWED                                                                                                |
| 500  | API_ERROR                                                                                                  |
| 502  | GATEWAY_ERROR                                                                                              |

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

Processes a payment for a service.

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

Verifies the status of a payment.

```javascript
const verifyPay = async () => {
  try {
    const response = await gsubz.verifyPay({ requestID: "3696898674" });
    console.log(response);
  } catch (error) {
    console.error(error);
  }
};
```
