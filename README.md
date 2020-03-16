# IBM-Watson-Assistant-Insurance
IBM Watson Insurance Chatbot to demonstrate how a user's emotional tone can be used to provide more tailored and empathetic responses by integrating Watson Assistant &amp; Watson Tone Analyzer Services.


## Prerequisites

1. Sign up for an [IBM Cloud account](https://console.bluemix.net/registration/).
2. Download the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview).
3. Create an instance of the Watson Assistant service and get your credentials:
    - Go to the [Watson Assistant](https://console.bluemix.net/catalog/services/conversation) page in the IBM Cloud Catalog.
    - Log in to your IBM Cloud account.
    - Click **Create**.
    - Click **Show** to view the service credentials.
    - Copy the `apikey` value, or copy the `username` and `password` values if your service instance doesn't provide an `apikey`.
    - Copy the `url` value.
4. Create an instance of the Tone Analyzer service and get your credentials:
    - Go to the [Tone Analyzer](https://console.bluemix.net/catalog/services/tone-analyzer) page in the IBM Cloud Catalog.
    - Log in to your IBM Cloud account.
    - Click **Create**.
    - Click **Show** to view the service credentials.
    - Copy the `apikey` value, or copy the `username` and `password` values if your service instance doesn't provide an `apikey`.
    - Copy the `url` value.
    
    
    
    
## Configuring the application

1. In your IBM Cloud console, open the Watson Assistant service instance

2. Click the **Import workspace** icon in the Watson Assistant service tool. Specify the location of the workspace JSON file in your local copy of the app project:

   `<project_root>/IBM-Watson-Assistant-Insurance/training/skill-INSURANCE-BOT.json`

3. Select **Everything (Intents, Entities, and Dialog)** and then click **Import**. The car dashboard workspace is created.

4. Click the menu icon in the upper-right corner of the workspace tile, and then select **View details**.

5. Click the ![Copy](readme_images/copy.png) icon to copy the workspace ID to the clipboard.

6. In the application folder, copy the *.env.example* file and create a file called *.env*

    ```
    cp .env.example .env
    ```

7. Open the *.env* file and add the service credentials that you obtained in the previous step.

    Example *.env* file that configures the `apikey` and `url` for a Watson Assistant service instance hosted in the US East region:

    ```
    ASSISTANT_IAM_APIKEY=<your-apikey>
    ASSISTANT_URL=<your-assistant-url>
    ```

    If your service instance uses `username` and `password` credentials, add the `ASSISTANT_USERNAME` and `ASSISTANT_PASSWORD` variables to the *.env* file.

    Example *.env* file that configures the `username`, `password`, and `url` for a Watson Assistant service instance hosted in the US South region:

    ```
    ASSISTANT_USERNAME=<your-assistant-username>
    ASSISTANT_PASSWORD=<your-assitant-password>
    ASSISTANT_URL=<your-assistant-url>
    ```

8. Add the `WORKSPACE_ID` to the previous properties

    ```
    WORKSPACE_ID=<your-workspace-id>
    ```


9. Your `.env` file  should looks like (for example):

    ```
    # Environment variables
    WORKSPACE_ID=1c464fa0-2b2f-4464-b2fb-af0ffebc3aab
    ASSISTANT_IAM_APIKEY=_5iLGHasd86t9NddddrbJPOFDdxrixnOJYvAATKi1
    ASSISTANT_URL=https://gateway-syd.watsonplatform.net/assistant/api

    TONE_ANALYZER_IAM_APIKEY=UdHqOFLzoOCFD2M50AbsasdYhOnLV6sd_C3ua5zah
    TONE_ANALYZER_URL=https://gateway-syd.watsonplatform.net/tone-analyzer/api
    ```

## Running locally

1. Install the dependencies

    ```
    npm install
    ```

2. Run the application

    ```
    npm start
    ```

3. View the application in a browser at `localhost:3000`



## Deploying to IBM Cloud as a Cloud Foundry Application

1. Login to IBM Cloud with the [IBM Cloud CLI](https://console.bluemix.net/docs/cli/index.html#overview)

    ```
    ibmcloud login
    ```

2. Target a Cloud Foundry organization and space.

    ```
    ibmcloud target --cf
    ```

3. Edit the *manifest.yml* file. Change the **name** field to something unique.  
  For example, `- name: my-app-name`.
4. Deploy the application

    ```
    ibmcloud app push
    ```

5. View the application online at the app URL.  
For example: https://my-app-name.mybluemix.net
