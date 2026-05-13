Software Requirements Specification (SRS)
1. Introduction
•	Purpose: To design a web-based dashboard that allows users to monitor environmental conditions (temperature, humidity, gas concentration) and view spoilage predictions in real time.
•	Scope: The dashboard will connect to a cloud database (Firebase), visualize sensor data, display machine learning predictions, and provide alerts when unsafe conditions are detected.
•	Users: Small-scale fruit vendors, households, and researchers.
2. System Overview
The dashboard is part of the IoT-AI Food Preservation System. It acts as the user interface layer, bridging:
•	IoT sensors (Arduino/ESP32) → send data to Firebase.
•	Machine Learning model (Python/TensorFlow) → predicts spoilage risk.
•	Dashboard (Node.js + React) → displays live data and predictions.
3. Functional Requirements
1.	Data Visualization
o	Display real-time temperature, humidity, and gas concentration.
o	Show historical trends (graphs).
2.	Prediction Display
o	Show spoilage risk (e.g., “Low”, “Medium”, “High”).
o	Display estimated remaining shelf life (e.g., “2 days left”).
3.	Alerts & Notifications
o	Trigger alerts when thresholds are exceeded.
o	Highlight unsafe conditions in the UI.
4.	User Interaction
o	Allow users to filter data by time range.
o	Provide access to historical logs.
5.	Authentication (Optional)
o	Secure login for vendors to access their storage data.
4. Non-Functional Requirements
•	Performance: Real-time updates with <2s latency.
•	Scalability: Support multiple storage boxes/users.
•	Usability: Simple, intuitive interface for non-technical users.
•	Reliability: Ensure data consistency between IoT devices and dashboard.
•	Security: Protect user data with Firebase authentication.
5. System Architecture
•	Frontend (React): Interactive dashboard UI.
•	Backend (Node.js/Express): API layer fetching data from Firebase and ML predictions.
•	Database (Firebase): Stores sensor readings and prediction results.
•	ML Service (Python/TensorFlow): Runs spoilage prediction and updates Firebase.
6. User Interface Design (Conceptual)
•	Home Page: Overview of current storage conditions.
•	Graphs Page: Historical trends of temperature, humidity, gas.
•	Prediction Page: Spoilage risk + shelf life estimation.
•	Alerts Section: Notifications when unsafe conditions occur.
7. Data Flow
1.	Sensors → ESP32 → Firebase (real-time data).
2.	ML model → Firebase (predictions).
3.	Node.js backend → Fetches data from Firebase.
4.	React frontend → Displays live data, graphs, and predictions.
8. Constraints
•	Limited hardware resources (ESP32, low-cost sensors).
•	Internet connectivity required for Firebase.
•	Energy efficiency must be considered for cooling control.
9. Future Enhancements
•	Mobile app version (React Native).
•	Multi-language support (English + Kinyarwanda).
•	Integration with SMS/WhatsApp alerts.
•	Solar-powered cooling system monitoring.
 In short: The Node.js backend acts as the bridge between Firebase and the frontend, while React provides a clean, interactive dashboard for users to monitor and predict fruit spoilage.

----------------------------------------------------------------------------------------------------

 
University of Rwanda
College of Science and Technology
Department of Computer and Software Engineering

Final Year Project.
Project Title: IoT and AI FOOD PRESERVATION SYSTEM
Members: 

Names                                                              Reg Number
1. Umugwaneza  Sandrine                                222013564
2 . Niyigaba       Theophile                               222003937


Supervisor: Dr. Ntalindwa Theoneste
Co-supervisor: Mr GASUHUKE Janvier

Date: 24/04/2026




Table of Contents

1. Abstract	5
Introduction	6
2.1 Background of the Study	6
2.2 Problem Statement	7
2.3 Research Objectives	8
2.3.1 General Objective	8
2.3.2 Specific Objectives	8
2.4 Research Questions	8
2.5 Significance of the Study	9
2.6 Scope of the Project	9
2.7 Organization of the Project	9
3. Literature Review	10
3.1 Overview of Food Storage Technologies	10
3.2 Smart Storage Systems Based on IoT	10
3.3 Thermodynamic Cooling Systems	11
3.4 Machine Learning Applications in Food Preservation	12
3.5 Predictive Models for Spoilage Detection	12
3.6 Review of Related Work	13
3.7 Research Gap	13
4. System Overview and Proposed Solution	13
4.1 Overview of the IoT-AI FOOD PRESERVATION SYSTEMSystem	13
4.2 System Architecture	14
4.3 Functional Modules of the System	15
4.3.1 Sensing Module	15
4.3.2 Processing and Control Module	15
4.3.3 Cooling Module	16
4.3.4 Cloud Data Management Module	16
4.3.5 Machine Learning Prediction Module	17
4.3.6 User Interface Module	17
4.4 System Workflow	18
5. Machine Learning Approach	18
5.1 Introduction to the Machine Learning Component	18
5.2 Data Collection and Dataset Description	19
5.3 Data Preprocessing	19
5.4 Feature Selection	20
5.5 Machine Learning Algorithms	20
5.5.1 Random Forest Model Algorithm	21
5.6 Fruit Condition Classification	22
5.7 Spoilage Prediction Model	22
5.8 Model Performance Evaluation	23
6. System Design	23
6.1 Overview of the System Design	23
6.2 Hardware Design	24
Microcontroller Unit	24
Environmental Sensors	24
Cooling System	25
Alert System	25
Power Supply	26
6.3 Software Design	26
Embedded Firmware	26
Cloud Database	26
Dashboard Interface	27
6.4 Use Case Diagram	27
6.5 Data Flow Diagram (DFD)	28
6.6 System Workflow	28
7. Thermodynamic Analysis	29
7.1 Overview of Thermodynamic Principles in Food Storage	29
7.2 Heat Transfer Mechanisms	29
Conduction	29
Convection	30
Radiation	30
7.3 Thermoelectric Cooling System	30
7.4 Cooling Load Calculation	31
7.5 Coefficient of Performance (COP)	31
7.6 Temperature Control Strategy	32
7.7 Impact on Fruit Preservation	32
8. Implementation Plan	33
8.1 Overview of Implementation Strategy	33
8.2 Hardware Implementation	33
8.3 Embedded Software Development	34
8.4 Cloud Integration	34
8.5 Machine Learning Model Development	35
8.6 Dashboard Development	35
8.7 System Integration	36
8.8 System Testing and Validation	36
9. Expected Results	37
9.1 Overview of Expected Outcomes	37
9.2 Functional System Prototype	37
9.3 Real-Time Environmental Monitoring	37
9.4 Fruit Spoilage Prediction	38
9.5 Improved Food Preservation	38
9.6 Reduction of Food Waste	39
9.7 Data-Driven Decision Making	39
9.8 Contribution to Smart Agriculture and Food Technology	39
10. Project Timeline	39
10.1 Overview of Project Schedule	39
10.2 Project Development Phases	40
10.3 Project Timeline Table	41
10.4 Gantt Chart Representation	41
11. Budget / Cost Estimation	42
11.1 Overview of Project Budget	42
11.2 Hardware Components Cost Estimation	42
11. Budget / Cost Estimation	43
11.1 Overview of Project Budget	43
11.2 Hardware Components Cost Estimation	43
11.3 Software and Development Tools	44
11.4 Miscellaneous Expenses	44
11.5 Total Estimated Project Cost	44
12. Conclusion	45
12.1 Summary of the Proposed System	45
12.2 Significance of the Project	45
12.3 Contribution to Technology and Research	46
12.4 Future Improvements	46
12.5 Final Remarks	46
References	47





1. Abstract
Food spoilage remains a significant challenge for households and small-scale vendors in Rwanda due to inadequate temperature control and the lack of affordable smart storage technologies. Fruits and vegetables are highly sensitive to environmental conditions such as temperature, humidity, and gas concentration. Without proper monitoring and control, these factors accelerate deterioration, leading to economic losses and reduced food quality. Traditional storage methods are often passive and reactive, meaning they respond only after unfavorable conditions occur rather than predicting them in advance.
This project proposes IoT-AI food preservation system, an AI-enhanced smart storage system designed to improve the preservation of perishable foods through the integration of embedded systems, Internet of Things (IoT) technologies, thermodynamic cooling control, and machine learning techniques. The system continuously monitors environmental parameters inside and outside the storage box using sensors that measure temperature, humidity, and gas concentration. These data are transmitted to a cloud database for real-time monitoring and analysis through a web-based dashboard.
Unlike conventional monitoring systems, the proposed solution incorporates a machine learning–based predictive model that analyzes historical sensor data to estimate fruit spoilage risk and remaining shelf life. The predictive model enables the system to anticipate future changes in storage conditions and take preventive actions such as activating cooling mechanisms before unsafe thresholds are reached. Additionally, thermodynamic principles such as heat transfer analysis and coefficient of performance (COP) measurement are used to evaluate the efficiency of the cooling system.
The project also includes experimental evaluation through prototype implementation and testing under different storage conditions. Performance will be assessed based on temperature stability, energy consumption, prediction accuracy of the machine learning model, and shelf-life improvement of stored fruits. By combining predictive analytics with real-time environmental control, IoT-AI food preservation system aims to provide an affordable and intelligent food preservation solution suitable for small-scale users in Rwanda.
Overall, this project demonstrates how the integration of IoT, thermodynamic modeling, and machine learning can contribute to reducing post-harvest food losses and improving storage management for perishable agricultural products.

Introduction
2.1 Background of the Study
Food preservation is an essential aspect of maintaining food quality, reducing waste, and ensuring food security. In many developing countries, including Rwanda, a large portion of agricultural products such as fruits and vegetables is lost after harvest due to poor storage conditions. Perishable foods are highly sensitive to environmental factors such as temperature, humidity, and gas concentration. When these parameters are not properly controlled, fruits deteriorate quickly, leading to significant economic losses for vendors and households.
Traditional storage methods commonly used by small-scale vendors rely on passive cooling or simple containers that do not regulate environmental conditions. While refrigeration systems can reduce spoilage, they are often expensive and not always accessible to small-scale users. Additionally, most existing low-cost monitoring systems only measure environmental parameters but do not actively predict or prevent spoilage.
Recent advances in embedded systems, Internet of Things (IoT), and machine learning provide new opportunities to improve food preservation technologies. IoT-based storage systems can monitor environmental conditions in real time using sensors, while cloud platforms allow data to be stored and analyzed remotely. Furthermore, machine learning algorithms can analyze historical environmental data to identify patterns and predict future outcomes, such as the likelihood of fruit spoilage.
By integrating thermodynamic cooling principles with intelligent predictive models, smart storage systems can move beyond simple monitoring and enable proactive management of food storage conditions. Such systems can automatically activate cooling mechanisms, detect early signs of spoilage, and provide useful information to users about the quality and expected shelf life of stored food.
The proposed project, IoT-AI food preservation system, aims to design and implement an AI-enhanced smart storage system capable of monitoring environmental parameters, predicting spoilage risks using machine learning models, and controlling cooling mechanisms to maintain optimal storage conditions. This approach combines sensor technology, embedded control systems, cloud computing, and predictive analytics to develop an affordable and intelligent food preservation solution suitable for small-scale users in Rwanda.

2.2 Problem Statement
In Rwanda, small-scale fruit vendors and households often face significant losses due to inadequate storage systems for perishable food products. Fruits and vegetables deteriorate rapidly when exposed to high temperatures, improper humidity levels, or poor ventilation. Because many vendors rely on traditional storage methods, they have limited ability to monitor or control environmental conditions that influence food quality.
Existing low-cost monitoring systems typically measure parameters such as temperature and humidity but do not provide predictive capabilities or intelligent decision-making. As a result, corrective actions such as cooling are only taken after unsafe conditions have already occurred, which may lead to accelerated spoilage and reduced product shelf life.
Furthermore, many storage systems lack mechanisms to analyze environmental data over time or use predictive models to estimate the remaining shelf life of stored fruits. Without such insights, vendors cannot effectively plan sales, adjust storage conditions, or reduce food waste.
Therefore, there is a need for an intelligent and affordable smart storage system that not only monitors environmental conditions but also predicts spoilage risks and optimizes cooling operations. By integrating IoT-based sensing, thermodynamic cooling control, and machine learning prediction models, the proposed IoT-AI food preservation system aims to provide proactive storage management that improves food preservation and reduces post-harvest losses.

2.3 Research Objectives
2.3.1 General Objective
To design and evaluate an AI-enhanced smart storage system that monitors environmental conditions, predicts fruit spoilage using machine learning techniques, and optimizes cooling performance to improve the preservation of perishable foods.
2.3.2 Specific Objectives
	To collect and monitor environmental data including temperature, humidity, and gas concentration using IoT sensors installed in the storage system.
	To develop a machine learning model capable of predicting fruit spoilage conditions and estimating the remaining shelf life based on collected sensor data.
	To evaluate the performance of the smart storage system in terms of cooling efficiency, energy consumption, and prediction accuracy.

2.4 Research Questions
This study seeks to answer the following research questions:
	How can environmental conditions inside a storage system be effectively monitored using IoT sensors?
	How can machine learning models be used to predict fruit spoilage and storage conditions over time?
	How effective is the proposed smart storage system in improving food preservation compared to traditional storage methods?

2.5 Significance of the Study
The development of the IoT-AI food preservation system provides several benefits for both technological advancement and practical applications. First, the system introduces an intelligent storage solution that integrates IoT technology with machine learning to improve food preservation. Second, it contributes to reducing post-harvest food losses, which is a major challenge in many developing countries.
For small-scale vendors and households in Rwanda, the system provides an affordable method for monitoring and controlling storage conditions, allowing users to extend the shelf life of fruits and vegetables. Additionally, the project contributes to academic research by demonstrating the integration of embedded systems, thermodynamic analysis, and predictive machine learning models within a single smart storage platform.

2.6 Scope of the Project
This project focuses on the design, development, and evaluation of a smart storage system for preserving perishable fruits. The system includes sensors for monitoring environmental parameters, a microcontroller for data processing and control, a cooling module for temperature regulation, and a cloud-based dashboard for data visualization.
The machine learning component of the system analyzes collected sensor data to predict fruit spoilage conditions and estimate remaining shelf life. The project will include prototype implementation and experimental testing to evaluate the effectiveness of the proposed solution under different storage scenarios.

2.7 Organization of the Project
The remainder of this report is organized as follows:
Chapter 3 presents the literature review on existing food storage technologies, IoT-based monitoring systems, and machine learning applications in food preservation.
Chapter 4 describes the overall system architecture and proposed solution.
Chapter 5 explains the machine learning approach used for spoilage prediction.
Chapter 6 details the system design including hardware and software components.
Chapter 7 presents the thermodynamic analysis used in the cooling system.
Chapter 8 describes the implementation of the proposed system.
Chapter 9 explains the experimental setup and testing procedures.
Chapter 10 presents the performance evaluation and results.
Chapter 11 discusses expected outcomes of the project.
Chapter 12 concludes the study and suggests possible future improvements.

3. Literature Review
3.1 Overview of Food Storage Technologies
Food preservation is essential for maintaining food quality and reducing post-harvest losses. Perishable products such as fruits and vegetables deteriorate quickly when exposed to unsuitable environmental conditions, including high temperature, improper humidity, and gas accumulation. Conventional storage methods often rely on passive cooling or simple containers that lack monitoring and control mechanisms. These traditional methods are ineffective in maintaining optimal storage conditions, especially in regions where refrigeration systems are expensive or unavailable.
Cold storage technologies have been widely used in the food industry to extend the shelf life of agricultural products. These systems regulate temperature and humidity to slow down biological processes that lead to spoilage. However, traditional cold storage systems are often costly and energy intensive, making them unsuitable for small-scale vendors and households. As a result, researchers have explored alternative smart storage solutions that integrate sensor technology and digital monitoring to improve food preservation.

3.2 Smart Storage Systems Based on IoT
The Internet of Things (IoT) has become an important technology for monitoring environmental conditions in agriculture and food storage systems. IoT-based systems use sensors, microcontrollers, and wireless communication technologies to collect and transmit real-time environmental data.
Several studies have demonstrated the use of IoT technology for monitoring storage conditions such as temperature, humidity, and gas concentration. For example, IoT-based monitoring systems commonly utilize sensors connected to microcontrollers such as ESP8266 or ESP32 to measure environmental parameters and transmit data to cloud platforms for real-time monitoring and analysis. 
These systems enable continuous monitoring of storage environments and allow users to receive alerts when environmental conditions deviate from safe levels. IoT solutions can significantly reduce the need for manual monitoring and improve the efficiency of food storage management.
In Rwanda, researchers have also explored IoT-based models for monitoring moisture levels in maize storage systems. These systems integrate sensors with cloud-based data analysis tools to help maintain optimal storage conditions and reduce food losses. 
Although IoT monitoring systems provide real-time data collection, many existing solutions only display environmental data without performing predictive analysis or automated decision-making.

3.3 Thermodynamic Cooling Systems
Thermodynamic principles play a critical role in food preservation systems. Cooling systems operate by removing heat from the storage environment to slow down biochemical reactions that cause food deterioration.
Heat transfer in storage systems typically occurs through conduction, convection, and radiation. The efficiency of a cooling system is often evaluated using thermodynamic parameters such as heat load and the Coefficient of Performance (COP), which measures the ratio between heat removed from the system and the electrical energy consumed.
Modern storage systems increasingly incorporate thermodynamic analysis to optimize cooling efficiency and reduce energy consumption. Predictive cooling methods can also be applied by analyzing the rate of temperature change within the storage environment. By anticipating temperature increases before they reach critical levels, cooling systems can maintain stable storage conditions while minimizing energy usage.

3.4 Machine Learning Applications in Food Preservation
Machine learning has emerged as a powerful tool for analyzing environmental data and predicting food quality changes. Machine learning algorithms can identify patterns in historical sensor data and generate predictive models that estimate future conditions.
In food storage systems, machine learning techniques can be used to predict spoilage risk, estimate shelf life, and optimize environmental control. For example, classification algorithms such as Decision Trees, Random Forest, and Logistic Regression can classify food conditions into categories such as fresh, ripening, or spoiled.
Recent research has shown that integrating machine learning with IoT-based monitoring systems can enable intelligent decision-making and proactive control of storage environments. Smart storage systems equipped with machine learning models can analyze real-time environmental data and predict future storage conditions, allowing corrective actions to be taken before spoilage occurs. 
These predictive capabilities significantly improve the effectiveness of storage systems compared to traditional monitoring-only approaches.

3.5 Predictive Models for Spoilage Detection
Predictive modeling techniques have been increasingly used to estimate the shelf life of perishable food products. These models analyze multiple environmental variables, including temperature, humidity, and gas concentrations, to determine how storage conditions affect the rate of spoilage.
Sensor-based monitoring systems can detect changes in environmental conditions and feed the collected data into predictive algorithms. These algorithms can estimate the probability of spoilage and provide early warnings to users. Intelligent packaging systems also use sensors to monitor food quality by detecting gases produced during food degradation, enabling early spoilage detection. 
By combining sensor monitoring with predictive analytics, smart storage systems can shift from reactive approaches to proactive food preservation strategies.

3.6 Review of Related Work
Several studies have explored the use of IoT technologies in agricultural storage systems. For example, IoT-based grain monitoring systems have been developed to measure environmental conditions in warehouses and prevent spoilage caused by moisture and temperature variations.
Other research projects have focused on smart storage systems that monitor agricultural products using sensor networks and cloud-based platforms. These systems collect environmental data continuously and allow users to monitor storage conditions remotely through mobile applications or web dashboards.
While these systems provide real-time monitoring capabilities, many of them do not integrate predictive machine learning models or advanced thermodynamic control mechanisms. As a result, their ability to prevent spoilage proactively is limited.

3.7 Research Gap
Although existing studies demonstrate the benefits of IoT-based monitoring systems in food storage, several limitations remain. Many current solutions focus primarily on environmental monitoring without implementing predictive analytics to estimate spoilage risk or remaining shelf life.
Additionally, most low-cost storage monitoring systems lack advanced thermodynamic analysis and intelligent cooling control mechanisms. Without these capabilities, storage systems cannot optimize energy consumption or respond proactively to changing environmental conditions.
Therefore, there is a need for an integrated smart storage system that combines IoT monitoring, thermodynamic cooling control, and machine learning-based predictive analytics. The proposed IoT-AI food preservation system aims to address this gap by developing an affordable intelligent storage solution capable of predicting spoilage conditions and optimizing cooling performance for small-scale users.

4. System Overview and Proposed Solution
4.1 Overview of the IoT-AI FOOD PRESERVATION SYSTEMSystem
The proposed system, IoT-AI food preservation system , is an intelligent food storage solution designed to improve the preservation of perishable fruits and vegetables. The system integrates embedded sensors, Internet of Things (IoT) technology, thermodynamic cooling control, and machine learning prediction models to monitor and manage environmental conditions inside a storage box.
The system continuously measures environmental parameters such as temperature, humidity, and gas concentration using sensors installed inside the storage container. These sensor readings are transmitted to a microcontroller, which processes the data and sends it to a cloud-based database through wireless communication.
Unlike traditional storage systems that only monitor environmental conditions, IoT-AI food preservation system incorporates a machine learning prediction module capable of analyzing historical sensor data to estimate fruit spoilage risk and remaining shelf life. Based on the predictions and measured conditions, the system can automatically activate cooling components to maintain optimal storage conditions.
The proposed system aims to reduce food spoilage by providing real-time monitoring, predictive analysis, and intelligent cooling control while remaining affordable and suitable for small-scale vendors and households.

4.2 System Architecture
The architecture of the IoT-AI food preservation system consists of multiple interconnected modules that work together to collect environmental data, analyze it, and control storage conditions.
The system architecture includes the following components:
	Sensing Layer
	Processing and Control Layer
	Cooling Layer
	Cloud Data Management Layer
	Machine Learning Prediction Layer
	User Interface Layer
In the sensing layer, environmental sensors collect real-time data from the storage box. This information is transmitted to the processing layer, where the microcontroller analyzes the data and makes control decisions.
The collected data is also transmitted to a cloud database, where it is stored for further analysis and visualization. The machine learning module uses this stored data to build predictive models that estimate spoilage conditions and recommend optimal cooling strategies.
Users can access system information through a web-based dashboard that displays real-time sensor readings, predictive insights, and system alerts.

4.3 Functional Modules of the System
To achieve the intended functionality, the IoT-AI food preservation system is organized into several functional modules.
4.3.1 Sensing Module
The sensing module is responsible for collecting environmental data from the storage environment. It consists of multiple sensors that continuously monitor parameters affecting food quality.
The main sensors used in the system include:
	Temperature sensors for measuring internal and external temperature
	Humidity sensors for monitoring relative humidity inside the storage box
	Gas sensors for detecting gases such as ethylene or carbon dioxide that indicate fruit ripening or spoilage.
These sensors provide the raw data required for environmental monitoring and machine learning analysis.

4.3.2 Processing and Control Module
The processing module is the core component of the system and is responsible for data processing and system control. It is implemented using a microcontroller such as the ESP8266 NodeMCU, which has built-in Wi-Fi capabilities for IoT communication.
The microcontroller performs several tasks, including:
	Reading data from sensors
	Processing environmental data
	Sending data to the cloud database
	Controlling cooling components based on environmental conditions.
	Communicating with the machine learning module
This module ensures that the system operates automatically and efficiently.

4.3.3 Cooling Module
The cooling module regulates the temperature inside the storage box to maintain suitable conditions for preserving fruits. It consists of components such as:
	Peltier cooling module
	Cooling fan
	Heat sink for heat dissipation.
The cooling system operates based on environmental conditions detected by the sensors. When the temperature inside the storage box rises above safe levels, the cooling system is activated to remove excess heat and restore optimal storage conditions.
This process helps slow down biological processes that cause food deterioration.

4.3.4 Cloud Data Management Module
The cloud module is responsible for storing and managing the data collected from the sensors. Sensor readings are transmitted to a cloud-based database such as Firebase, where they are stored for further analysis.
The cloud platform enables several important functions:
	Real-time data storage
	Historical data analysis
	Communication with the machine learning prediction system
	Remote access through the web dashboard
By storing environmental data in the cloud, the system allows users to monitor storage conditions from any location.

4.3.5 Machine Learning Prediction Module
The machine learning module analyzes historical environmental data to identify patterns that influence fruit spoilage. The module uses supervised machine learning algorithms to predict storage conditions and estimate the remaining shelf life of fruits.
The prediction model receives input data from the sensor database, including:
	Temperature readings
	Humidity levels
	Gas concentration
	Storage duration
Using this information, the machine learning model generates predictions such as:
	Probability of fruit spoilage
	Estimated remaining shelf life
	Recommended cooling actions
These predictions allow the system to take preventive actions before spoilage occurs.

4.3.6 User Interface Module
The user interface provides an interactive platform through which users can monitor and control the storage system. The interface is implemented as a web-based dashboard that displays real-time environmental data and predictive insights.
The dashboard allows users to:
	View real-time temperature and humidity levels.
	Monitor gas concentrations.
	Receive alerts when storage conditions become unsafe.
	View predictive analysis of fruit spoilage.
	Access historical environmental data
This interface ensures that users can easily monitor the storage system without requiring advanced technical knowledge.

4.4 System Workflow
The operation of the IoT-AI food preservation system follows a continuous workflow consisting of several steps:
	Environmental sensors measure temperature, humidity, and gas levels inside the storage box.
	The microcontroller collects the sensor readings and processes the data.
	The processed data is transmitted to the cloud database through an IoT communication network.
	The machine learning model analyzes historical sensor data and generates spoilage predictions.
	Based on sensor readings and prediction results, the system decides whether to activate the cooling module.
	The user dashboard displays real-time data and predictive insights to the user.
Through this workflow, the system provides continuous monitoring, predictive analysis, and automated environmental control.

5. Machine Learning Approach
5.1 Introduction to the Machine Learning Component
Machine learning plays an important role in enabling intelligent decision-making in modern smart systems. In the proposed IoT-AI food preservation system, machine learning techniques are used to analyze environmental data collected from sensors and predict potential fruit spoilage conditions.
Unlike traditional monitoring systems that only display environmental parameters, the machine learning component enables the system to analyze patterns in historical data and estimate the probability of spoilage and remaining shelf life of stored fruits. By providing predictive insights, the system allows users to take preventive actions before spoilage occurs.
The machine learning model processes environmental data such as temperature, humidity, gas concentration, and storage time to classify fruit condition and predict future storage outcomes.

5.2 Data Collection and Dataset Description
The machine learning model requires a dataset that represents the environmental conditions affecting fruit storage. The dataset will be generated using sensor data collected from the IoT-AI food preservation system prototype during experimental testing.
The system will continuously record the following parameters:
	Internal temperature of the storage box
	External temperature
	Relative humidity
	Gas concentration indicating fruit ripening or spoilage.
	Storage duration
	Observed fruit condition (fresh, ripening, or spoiled)
Each data record in the dataset represents a specific storage condition at a particular time. The collected data will be stored in the cloud database and later exported for machine learning model training.


A simplified example of the dataset structure is shown below:
Temperature (°C)	Humidity (%)	Gas Level (ppm)	Storage Time (hours)	Fruit Condition
13	65	120	12	Fresh
15	70	180	24	Ripening
18	75	240	36	Spoiling

This dataset provides the necessary information for training machine learning models capable of predicting fruit condition and spoilage risk.

5.3 Data Preprocessing
Before training the machine learning model, the collected dataset must be preprocessed to improve data quality and ensure accurate model performance.
The preprocessing steps include:
Data Cleaning
 Removing incorrect or incomplete data records that may occur due to sensor errors or communication interruptions.
Handling Missing Values
 If some sensor readings are missing, appropriate techniques such as interpolation or mean substitution may be applied.
Normalization
 Sensor measurements may be scaled to ensure consistent ranges across different variables.
Label Encoding
 Categorical labels such as fruit conditions (Fresh, Ripening, Spoiling) are converted into numerical values that can be processed by machine learning algorithms.
These preprocessing steps help improve the reliability and accuracy of the predictive model.

5.4 Feature Selection
Feature selection is an important step in machine learning that involves identifying the most relevant input variables for prediction. In the IoT-AI food preservation system, the following features are considered significant for predicting fruit spoilage:
	Internal temperature
	Relative humidity
	Gas concentration
	Storage duration
	External temperature
These features represent the key environmental factors that influence fruit deterioration. By selecting relevant features, the machine learning model can focus on the most informative data and improve prediction performance.

5.5 Machine Learning Algorithms
Several supervised machine learning algorithms will be evaluated to determine the most suitable model for spoilage prediction.
5.5.1 Random Forest Model Algorithm
In this project, the Random Forest model is used as the core predictive engine within the Machine Learning Prediction Module. After environmental data is collected by the IoT sensors such as temperature, humidity, gas concentration, and storage duration it is transmitted to the cloud database. The Random Forest model processes this data to classify the fruit condition and estimate spoilage risk.
During training, the model learns patterns from historical sensor readings and observed fruit conditions. Each decision tree in the forest analyzes different subsets of the dataset, identifying relationships between environmental factors and spoilage behavior. When new real time data is received, each tree generates a prediction, and the Random Forest combines these outputs to produce a final, more reliable classification. This prediction is then used by the system to determine whether cooling should be activated or whether the user should be alerted about potential spoilage.
By integrating Random Forest into the system workflow, the IoT AI food preservation system becomes proactive rather than reactive. Instead of waiting for temperature or gas levels to exceed safe thresholds, the system can anticipate spoilage trends and take preventive actions early. This significantly improves the shelf life of stored fruits and reduces food waste.
Random Forest was selected for this project because it provides high accuracy and stability when dealing with the complex environmental factors that influence fruit spoilage. Variables such as temperature, humidity, gas concentration, and storage duration interact in non linear ways, and Random Forest is well suited to capturing these patterns. Its ensemble structure makes it naturally robust to noise and fluctuations in sensor readings, which is important in IoT systems where sensors may produce inconsistent data. This ensures that the model can still generate reliable predictions even when the dataset contains measurement errors or environmental disturbances.
The model was also chosen because it performs well with the small and medium sized datasets generated during prototype testing. Unlike deep learning models that require large datasets and high computational power, Random Forest is lightweight, easy to implement, and integrates smoothly with tools such as scikit learn. It reduces the risk of overfitting by combining multiple decision trees, resulting in stable real time predictions. Additionally, its ability to provide feature importance helps identify which environmental factors contribute most to spoilage, supporting system optimization and more effective cooling control.
5.5.2 How the Random Forest Model Will Work in the System
Once the model predicts the spoilage risk, the system uses this information to make proactive decisions. If the Random Forest model detects that conditions are trending toward spoilage, it triggers the cooling module to stabilize the environment before the fruit deteriorates. The prediction results are also displayed on the user dashboard, allowing users to monitor fruit condition and receive alerts. This integration enables the system to move beyond simple monitoring and instead provide intelligent, data driven control that improves preservation efficiency and reduces food waste.
5.5.3 Broader Contributions of Machine Learning
Beyond predicting spoilage, machine learning plays a broader role in transforming the storage system from a passive monitoring tool into an intelligent decision making platform. ML enables the system to learn patterns from historical sensor data and continuously improve its understanding of how different environmental conditions affect fruit quality. This allows the system to not only classify fruit condition but also detect abnormal trends, identify early signs of deterioration, and anticipate future changes in storage conditions. As more data is collected, the model becomes more accurate, making the system adaptive and capable of improving its performance over time.
Machine learning also supports system optimization by identifying which environmental factors have the greatest impact on spoilage, helping refine sensor placement, cooling strategies, and energy usage. Additionally, ML enables personalized recommendations for users by analyzing storage patterns and suggesting optimal temperature or humidity settings for different types of fruits. This predictive and adaptive capability ensures that the IoT AI food preservation system operates efficiently, reduces unnecessary cooling cycles, and ultimately extends the shelf life of stored produce while minimizing energy consumption.
5.6 Fruit Condition Classification
The machine learning model is designed as a classification problem, where the system predicts the condition of stored fruits based on environmental conditions.
The predicted classes include:
	Fresh – Fruits are stored under safe conditions with low risk of spoilage.
	Ripening – Fruits are approaching maturity and require careful monitoring.
	Spoiling – Storage conditions are unfavorable and fruit deterioration is likely.
By classifying fruit conditions, the system can generate warnings and recommend corrective actions such as activating cooling mechanisms.

5.7 Spoilage Prediction Model
The trained machine learning model will analyze real-time sensor data and estimate the probability of fruit spoilage. The prediction results will be integrated into the system dashboard to provide useful insights to users.
The model will produce outputs such as:
	Predicted fruit condition.
	Estimated remaining shelf life.
	Spoilage risk level
These predictions allow the system to shift from a reactive approach to a predictive food preservation strategy.

5.8 Model Performance Evaluation
To ensure the reliability of the machine learning model, its performance will be evaluated using standard classification metrics.
The following metrics will be used:
Accuracy
 The proportion of correct predictions made by the model.
Precision
 The proportion of correctly predicted spoilage cases among all predicted spoilage cases.
Recall
 The ability of the model to correctly detect actual spoilage events.
F1 Score
 A combined metric that balances precision and recall.
The model with the best overall performance will be selected for integration into the IoT-AI food preservation system.

6. System Design
6.1 Overview of the System Design
The system design of IoT-AI food preservation system describes the technical structure and operational components required to implement the proposed smart storage system. The design integrates hardware components, embedded software, cloud-based services, and machine learning models to monitor environmental conditions and predict fruit spoilage.
The system is designed as an IoT-enabled embedded platform consisting of sensors, a microcontroller, a cooling mechanism, and a cloud-based monitoring dashboard. The architecture ensures continuous environmental monitoring, predictive analysis, and automated cooling control.
The design is divided into two main parts:
	Hardware design, which includes the physical components of the system.
	Software design, which includes firmware, cloud services, and machine learning algorithms.
Together, these components form an integrated system capable of monitoring, predicting, and controlling storage conditions.

6.2 Hardware Design
The hardware design focuses on the physical components used to collect environmental data and control the cooling process inside the storage box.
The key hardware components of the system include:
Microcontroller Unit
The system uses an ESP8266 NodeMCU microcontroller as the central processing unit. The ESP8266 is selected because it supports Wi-Fi communication, allowing the system to transmit sensor data to cloud platforms.
The microcontroller performs the following functions:
	Reading data from sensors
	Processing environmental measurements
	Controlling the cooling system
	Sending data to the cloud database
	Communicating with the machine learning module

Environmental Sensors
Multiple sensors are used to measure environmental conditions inside the storage box.
Temperature and Humidity Sensor
A temperature and humidity sensor such as DHT11 or DHT22 measures internal storage conditions. These parameters are critical for maintaining suitable conditions for fruit preservation.
Gas Sensor
A gas sensor such as MQ-135 detects gases released during fruit ripening and spoilage, including carbon dioxide and ethylene. Gas detection helps identify early stages of fruit deterioration.

Cooling System
The cooling system regulates the internal temperature of the storage box to slow down fruit spoilage.
The cooling system includes:
	Peltier cooling module (TEC1-12706)
	Cooling fan
	Heat sink for thermal dissipation.
The Peltier module operates based on the thermoelectric effect, transferring heat from the cold side inside the box to the hot side outside the box.

Alert System
An alert system is included to notify users when storage conditions become unsafe.
The alert components include:
	LED indicators
	Buzzer
These components provide visual and audio warnings when environmental parameters exceed safe thresholds.

Power Supply
A 12V DC power supply is used to provide electrical energy for the cooling module and other electronic components. Voltage regulation is applied to ensure stable power delivery to the microcontroller and sensors.

6.3 Software Design
The software design defines the logic that controls system operations and data communication.
The system software consists of three main parts:
	Embedded firmware
	Cloud data management
	Machine learning prediction system

Embedded Firmware
The firmware is programmed using Arduino IDE and runs on the ESP8266 microcontroller.
The firmware performs several tasks:
	Collects sensor readings at regular intervals.
	Processes environmental data
	Sends data to the cloud database.
	Controls the cooling system based on predefined rules.
	Communicates with the machine learning module.

Cloud Database
The system uses a cloud-based database such as Firebase Realtime Database to store sensor data and system logs.
The cloud database allows:
	Real-time data storage
	Historical data analysis
	Communication with machine learning algorithms
	Remote monitoring through the web dashboard

Dashboard Interface
A web-based dashboard is developed using HTML, CSS, JavaScript, and Chart.js to display system data.
The dashboard provides the following features:
	Real-time temperature and humidity monitoring
	Visualization of historical sensor data
	Spoilage prediction results from the machine learning model
	System alerts and notifications

6.4 Use Case Diagram
The use case diagram describes interactions between users and the IoT-AI food preservation system.
The main actors in the system include:
User (Vendor or Household)
 The user interacts with the system through the dashboard to monitor storage conditions and receive alerts.
Automated System
 The system automatically monitors environmental conditions, processes data, and controls the cooling mechanism.
The main use cases include:
	Monitoring temperature and humidity
	Viewing system dashboard
	Receiving alerts
	Viewing fruit spoilage predictions
	Configuring storage parameters
These interactions ensure that users can easily monitor and manage the storage system.

6.5 Data Flow Diagram (DFD)
The Data Flow Diagram illustrates how data moves within the IoT-AI food preservation system.
At the highest level, the system receives environmental data from sensors and produces outputs such as cooling control signals, dashboard data, and user alerts.
The main processes include:
	Sensor Data Collection
 Sensors measure temperature, humidity, and gas levels inside the storage box.
	Data Processing
 The microcontroller processes sensor readings and prepares the data for transmission.
	Cloud Data Storage
 Sensor data is transmitted to the cloud database where it is stored for further analysis.
	Machine Learning Analysis
 The machine learning model processes historical data and generates spoilage predictions.
	User Notification
 Prediction results and system alerts are displayed on the user dashboard.

6.6 System Workflow
The operational workflow of the IoT-AI food preservation system consists of the following steps:
	Environmental sensors measure storage conditions.
	Sensor readings are transmitted to the microcontroller.
	The microcontroller processes the data and sends it to the cloud database.
	The machine learning model analyzes stored data to predict fruit spoilage.
	The system activates cooling components if environmental conditions become unsafe.
	The dashboard displays real-time data and prediction results to the user.
This workflow ensures continuous monitoring, intelligent prediction, and automated control of the storage environment.
7. Thermodynamic Analysis
7.1 Overview of Thermodynamic Principles in Food Storage
Thermodynamics plays a crucial role in food preservation systems because temperature directly affects the rate of biological and chemical reactions that lead to food spoilage. When fruits and vegetables are stored at lower temperatures, the metabolic processes responsible for ripening and microbial growth slow down significantly. As a result, maintaining a stable low-temperature environment helps extend the shelf life of perishable products.
The IoT-AI food preservation system incorporates thermodynamic principles to regulate heat transfer inside the storage box. By controlling temperature and humidity levels, the system creates an environment that slows down spoilage processes and preserves food quality.
The cooling system operates by transferring heat from the inside of the storage container to the external environment using thermoelectric cooling technology.

7.2 Heat Transfer Mechanisms
Heat transfer occurs in three primary ways within the IoT-AI food preservation storage system:
Conduction
Conduction occurs when heat moves through solid materials. In the storage box, heat conduction takes place through the walls of the container and the heat sink connected to the cooling module.
The rate of heat transfer through conduction can be expressed using Fourier’s Law of Heat Conduction:
Q=kA(Temp inside- Temp outside)/d


Where Q is heat transfer rate in Watt
                k = thermal conductivity of the material
              A = surface area through which heat is transferred
              d = thickness of the material
             T_inside = internal temperature
             T_outside = external temperature
Proper insulation of the storage box helps reduce heat transfer through conduction.

Convection
Convection occurs when heat is transferred through the movement of air. Inside the IoT-AI food preservation system, convection happens when the cooling fan circulates air within the storage box.
The fan helps distribute cold air evenly, ensuring that all stored fruits experience similar temperature conditions. This prevents localized temperature variations that may accelerate spoilage.

Radiation
Radiation refers to heat transfer through electromagnetic waves. Although radiation contributes less to heat transfer in the storage system compared to conduction and convection, it still plays a minor role in transferring heat between internal components.

7.3 Thermoelectric Cooling System
The IoT-AI food preservation system uses a thermoelectric cooling module (Peltier module) to regulate temperature.
The thermoelectric cooling effect occurs when an electric current passes through two different semiconductor materials. This process causes heat to be absorbed on one side of the module and released on the other side.
The cold side of the Peltier module cools the interior of the storage box, while the hot side dissipates heat through a heat sink and cooling fan.
The advantages of thermoelectric cooling include:
	Compact design
	No moving mechanical compressor
	Low maintenance requirements
	Suitable for small-scale cooling systems
These characteristics make Peltier modules ideal for smart storage systems.

7.4 Cooling Load Calculation
To maintain the desired internal temperature, the cooling system must remove the heat entering the storage box. The total cooling load depends on several factors:
	Heat transfer through container walls.
	Heat produced by stored fruits during respiration.
	Heat introduced when the storage box is opened.
	Ambient environmental temperature
The cooling load can be approximated using the equation:
Q=mCp ΔT
Where:
Q = heat energy removed (J)
m = mass of stored food (kg)
Cₚ = specific heat capacity of the food
ΔT = temperature difference between storage and ambient conditions
Understanding the cooling load helps determine the appropriate capacity of the thermoelectric cooling module.
7.5 Coefficient of Performance (COP)
The efficiency of the cooling system is measured using the Coefficient of Performance (COP).
Q=Qc/W
Where:
	Q_c = heat removed from the storage box
	W = electrical power consumed by the cooling module
A higher COP indicates a more efficient cooling system. Optimizing cooling efficiency helps reduce energy consumption while maintaining proper storage conditions.

7.6 Temperature Control Strategy
The IoT-AI food preservation system implements an intelligent temperature control strategy that combines thermodynamic analysis with machine learning predictions.
The control strategy operates as follows:
	Sensors continuously measure internal temperature and humidity.
	The microcontroller compares sensor readings with predefined optimal ranges.
	If the temperature exceeds safe limits, the cooling system is activated.
	The machine learning model analyzes historical temperature patterns to predict potential temperature increases.
	Preventive cooling is applied before critical temperature thresholds are reached.
This predictive control strategy improves storage efficiency and reduces energy consumption.

7.7 Impact on Fruit Preservation
Maintaining stable storage conditions significantly reduces the rate of fruit deterioration. Temperature and humidity control slow down enzymatic reactions, microbial growth, and respiration processes that lead to spoilage.
By integrating thermodynamic cooling with sensor monitoring and machine learning prediction, the IoT-AI food preservation system provides an advanced approach to food preservation.
The system enables proactive storage management, ensuring that fruits remain fresh for longer periods while minimizing energy usage and operational costs.

8. Implementation Plan
8.1 Overview of Implementation Strategy
The implementation of the IoT-AI food preservation system will follow a structured development approach that integrates hardware development, software programming, IoT communication, and machine learning model training. The project will be implemented through several phases to ensure proper design, testing, and system integration.
The implementation strategy focuses on building a working prototype capable of monitoring environmental conditions, predicting fruit spoilage, and controlling the cooling system automatically.
The development process includes the following stages:
	Requirements analysis and system design
	Hardware development and sensor integration
	Embedded software programming
	Cloud database integration
	Machine learning model development
	Dashboard development
	System integration and testing
Each stage will be completed sequentially to ensure proper functionality of the system components.

8.2 Hardware Implementation
The hardware implementation stage involves assembling the physical components required for the IoT-AI food preservation system.
The first step is to construct the storage container that will house the electronic components and fruits. Sensors will be installed inside the container to measure environmental conditions such as temperature, humidity, and gas concentration.
The ESP8266 NodeMCU microcontroller will be connected to the sensors and programmed to collect environmental data. The microcontroller will also control the cooling module using relay circuits or transistor drivers.
The thermoelectric Peltier cooling module will be installed with a heat sink and cooling fan to regulate internal temperature. Proper insulation will be added to the storage box to reduce heat transfer and improve cooling efficiency.
Once all hardware components are connected, initial tests will be conducted to verify sensor functionality and cooling performance.

8.3 Embedded Software Development
Embedded software development involves programming the microcontroller to manage sensor readings, control the cooling system, and transmit data to the cloud.
The firmware will be developed using the Arduino Integrated Development Environment (Arduino IDE). The program will include several functional modules such as:
	Sensor data acquisition module
	Wi-Fi communication module
	Cooling system control module
	Data transmission module
The firmware will continuously read sensor values and compare them with predefined environmental thresholds. If temperature or humidity levels exceed safe limits, the cooling module will automatically activate to restore optimal storage conditions.
The microcontroller will also transmit sensor data to the cloud database for real-time monitoring and machine learning analysis.

8.4 Cloud Integration
The system will use a cloud platform such as Firebase Realtime Database to store environmental data collected from sensors.
The ESP8266 microcontroller will transmit data to the cloud through Wi-Fi communication using HTTP or MQTT protocols. The stored data will include temperature, humidity, gas levels, and timestamp information.
Cloud storage provides several advantages:
	Remote monitoring of storage conditions
	Storage of historical environmental data
	Data availability for machine learning model training
	Communication with the web dashboard
The cloud platform acts as the central data repository for the entire system.

8.5 Machine Learning Model Development
The machine learning component of the system will be developed using Python and machine learning libraries such as Scikit-learn.
The development process includes several steps:
	Collecting sensor data from the cloud database
	Preparing the dataset through preprocessing and cleaning
	Selecting relevant features such as temperature, humidity, gas levels, and storage time
	Training machine learning models using classification algorithms.
	Evaluating model performance using accuracy, precision, recall, and F1-score
	Selecting the best-performing model for integration into the system
The trained machine learning model will be used to predict fruit spoilage risk and estimate the remaining shelf life of stored fruits.

8.6 Dashboard Development
A web-based dashboard will be developed to allow users to monitor storage conditions and prediction results.
The dashboard will be built using HTML, CSS, JavaScript, and Chart.js for data visualization. The dashboard will connect to the cloud database and display real-time sensor readings.
Key dashboard features include:
	Real-time temperature and humidity monitoring
	Visualization of historical environmental data
	Spoilage prediction results from the machine learning model
	System alerts when storage conditions become unsafe.
The dashboard will provide a user-friendly interface for vendors and households to monitor food storage conditions easily.

8.7 System Integration
After individual modules have been developed, the hardware and software components will be integrated into a single functional system.
System integration involves connecting the microcontroller, sensors, cooling module, cloud database, machine learning model, and dashboard interface.
Testing will be conducted to ensure that:
	Sensor data is correctly transmitted to the cloud.
	Machine learning predictions are accurate.
	The cooling system responds to environmental changes.
	Dashboard data updates in real time
Integration testing ensures that all system components function together as intended.

8.8 System Testing and Validation
The final stage of implementation involves testing the complete system under different environmental conditions.
Testing will focus on evaluating the following aspects:
	Accuracy of sensor measurements
	Efficiency of the cooling system
	Reliability of data transmission
	Performance of the machine learning model
	Usability of the dashboard interface
Experimental testing will involve storing fruits inside the IoT-AI food preservation system and monitoring how well the system maintains optimal storage conditions and predicts spoilage.
The results obtained from testing will be used to validate the effectiveness of the proposed system.
9. Expected Results
9.1 Overview of Expected Outcomes
The IoT-AI food preservation system project is expected to produce a functional prototype of a smart food storage system capable of monitoring environmental conditions, predicting fruit spoilage, and automatically controlling cooling mechanisms. The system integrates Internet of Things (IoT) technology, machine learning algorithms, and thermodynamic cooling principles to improve the preservation of perishable fruits and vegetables.
Through the implementation of this system, users such as small-scale fruit vendors, households, and food storage facilities will be able to monitor storage conditions in real time and receive early warnings when fruits are likely to spoil.

9.2 Functional System Prototype
One of the primary expected outcomes of the project is the development of a working prototype of the IoT-AI food preservation system. The prototype will consist of a storage container equipped with sensors, a microcontroller, and a thermoelectric cooling module.
The prototype will be capable of performing the following functions:
	Measuring temperature, humidity, and gas levels inside the storage box
	Automatically activating the cooling system when temperature exceeds safe limits
	Transmitting environmental data to a cloud database
	Displaying real-time monitoring information through a web-based dashboard
	Generating predictive insights using machine learning algorithms
This prototype will demonstrate the feasibility of using IoT and AI technologies for intelligent food preservation.

9.3 Real-Time Environmental Monitoring
The system is expected to provide continuous monitoring of environmental conditions inside the storage container. The sensors will collect data at regular intervals and transmit the information to a cloud database for storage and analysis.
Users will be able to access real-time data through the dashboard, allowing them to observe parameters such as:
	Internal temperature
	Relative humidity
	Gas concentration levels
	Storage duration
This monitoring capability will enable users to understand how environmental conditions affect fruit preservation.

9.4 Fruit Spoilage Prediction
Another key expected outcome is the development of a machine learning model capable of predicting fruit spoilage based on environmental conditions.
The machine learning algorithm will analyze historical sensor data and classify fruit conditions into categories such as:
	Fresh
	Ripening
	Spoiling
By predicting spoilage conditions early, the system will allow users to take corrective actions before food loss occurs.

9.5 Improved Food Preservation
The IoT-AI food preservation system is expected to improve fruit preservation by maintaining stable storage conditions. The thermoelectric cooling system will regulate internal temperature and slow down biological processes responsible for fruit deterioration.
By maintaining proper storage conditions, the system can help extend the shelf life of fruits and reduce post-harvest losses.

9.6 Reduction of Food Waste
Food waste is a major challenge in many developing countries, including Rwanda, where post-harvest losses affect both farmers and vendors. The proposed system is expected to reduce food waste by providing predictive insights and maintaining optimal storage conditions.
With the help of the IoT-AI food preservation system, users can identify potential spoilage risks and respond quickly to prevent fruit deterioration.

9.7 Data-Driven Decision Making
The system will generate valuable environmental data that can be used to analyze fruit storage patterns. Historical data collected by the system can help users understand how factors such as temperature and humidity influence fruit shelf life.
This data-driven approach enables better decision-making for food storage and supply chain management.

9.8 Contribution to Smart Agriculture and Food Technology
The successful implementation of this project will contribute to the advancement of smart agriculture and intelligent food preservation technologies. By combining IoT monitoring, thermodynamic cooling, and machine learning prediction, the project demonstrates how modern technologies can be applied to solve real-world problems in food storage.
The system may also inspire further research into affordable smart storage solutions for small-scale agricultural markets in Rwanda and other developing countries.
10. Project Timeline
10.1 Overview of Project Schedule
The development of the IoT-AI food preservation system will be carried out over a period of several months, following the academic calendar for the final year project. The project will be divided into multiple phases to ensure systematic development, testing, and documentation.
Each phase focuses on specific activities such as literature review, system design, hardware development, software implementation, machine learning model training, and final testing. This structured approach ensures that the project progresses efficiently and all components are completed within the allocated timeframe.

10.2 Project Development Phases
The implementation of the project will be carried out through the following phases:
Phase 1: Project Proposal and Literature Review
 This phase involves identifying the research problem, selecting the project topic, and reviewing existing studies related to smart food storage systems, IoT technologies, thermodynamic cooling, and machine learning approaches. The proposal document will also be prepared and submitted for approval.
Phase 2: System Design
 During this stage, the overall system architecture will be designed. This includes defining hardware components, software architecture, machine learning models, and communication protocols. Diagrams such as system architecture diagrams and data flow diagrams will be developed.
Phase 3: Hardware Development
 This phase focuses on assembling the hardware components of the system. Sensors, microcontrollers, cooling modules, and power supply units will be installed inside the storage container. Initial testing will be conducted to ensure proper hardware functionality.
Phase 4: Embedded Software Development
 The microcontroller firmware will be developed using the Arduino programming environment. The firmware will manage sensor readings, data transmission, and cooling system control.
Phase 5: Cloud Integration and Dashboard Development
 A cloud database will be configured to store environmental data collected from sensors. A web-based dashboard will also be developed to allow users to monitor system data and predictions in real time.
Phase 6: Machine Learning Model Development
 During this phase, sensor data will be collected and used to train machine learning models for fruit spoilage prediction. Different algorithms will be tested and evaluated to determine the most suitable model.
Phase 7: System Integration and Testing
 All hardware and software components will be integrated into a complete system. Testing will be conducted under different environmental conditions to evaluate system performance and prediction accuracy.
Phase 8: Final Documentation and Project Presentation
 The final stage involves preparing the project report, compiling results, and presenting the system to the academic evaluation committee.

10.3 Project Timeline Table
The project timeline is summarized in the following table:
Project Phase	Activities	Duration
Phase 1	Proposal writing and literature review	week 1
Phase 2	System architecture and design	week 2
Phase 3	Hardware assembly and sensor integration	week 3
Phase 4	Embedded software development	week 4
Phase 5	Cloud integration and dashboard development	week 5
Phase 6	Machine learning model training	week 6
Phase 7	System integration and testing	week 7
Phase 8	Final report writing and project presentation	week 8


10.4 Gantt Chart Representation
The Gantt chart below illustrates the scheduling of the major project activities over the project duration.

Task	Week1	Week2	Week3	Week4	Week5	Week6	Week7	Week8
Proposal & Literature Review	█							
System Design		█						
Hardware Development			█					
Embedded Software Development				█				
Cloud & Dashboard Development					█			
Machine Learning Model						█		
System Integration & Testing							█	
Final Documentation & Presentation								█

11. Budget / Cost Estimation
11.1 Overview of Project Budget
The development of the IoT-AI food preservation system requires several hardware components, electronic modules, and supporting materials. The budget estimation includes the cost of sensors, microcontrollers, cooling modules, electronic accessories, and other materials required to construct the prototype.
The objective of this project is to design a low-cost intelligent food storage system that can be affordable for small-scale vendors and households. Therefore, commonly available and cost-effective electronic components are selected for the implementation.
The budget presented in this section represents an estimated cost for building the prototype of the proposed system.

11.2 Hardware Components Cost Estimation
The table below summarizes the main hardware components required for the IoT-AI food preservation system and their estimated costs.
11. Budget / Cost Estimation
11.1 Overview of Project Budget
The development of this project requires several hardware components, electronic modules, and supporting materials. The budget estimation includes the cost of sensors, microcontrollers, cooling modules, electronic accessories, and other materials required to construct the prototype.
The objective of this project is to design a low-cost intelligent food storage system that can be affordable for small-scale vendors and households. Therefore, commonly available and cost-effective electronic components are selected for the implementation.
The budget presented in this section represents an estimated cost for building the prototype of the proposed system.

11.2 Hardware Components Cost Estimation
The table below summarizes the main hardware components required for the IoT-AI food preservation system and their estimated costs.
No.	Component	Quantity	Estimated Unit Cost (USD)	Total Cost (USD)
1	ESP8266 NodeMCU Microcontroller	1	$8	$8
2	Temperature and Humidity Sensor (DHT22)	1	$8	$6
3	Gas Sensor (MQ-135)	1	$7	$7
4	Peltier Cooling Module (TEC1-12706)	1	$10	$10
5	Heat Sink with Cooling Fan	1	$8	$8
6	Relay Module	1	$4	$4
7	Power Supply (12V Adapter)	1	$12	$12
8	Breadboard and Jumper Wires	1 set	$5	$5
9	Storage Box and Insulation Materials	1	$15	$15
10	LEDs and Buzzer (Alert System)	1 set	$3	$3

Total Estimated Cost: $78

11.3 Software and Development Tools
Most of the software tools required for the development of this project are open-source or freely available. These tools include:
	Arduino IDE for microcontroller programming
	Python for machine learning model development
	Scikit-learn machine learning library
	Firebase Realtime Database for cloud data storage
	HTML, CSS, and JavaScript for dashboard development
	Chart.js for data visualization
Since these tools are free, they do not add additional cost to the project budget.

11.4 Miscellaneous Expenses
Additional expenses may arise during the development and testing stages. These may include:
	Transportation costs for purchasing components.
	Internet access for cloud communication and system development
	Replacement of damaged electronic components during testing
A small contingency budget is therefore allocated to cover unexpected costs.
Item	Estimated Cost
Miscellaneous and contingency expenses	$20

11.5 Total Estimated Project Cost
The total estimated cost for developing the IoT-AI food preservation system prototype is summarized below:
Category	Estimated Cost
Hardware Components	$80
Miscellaneous Expenses	$20
Total Estimated Budget: ≈ $100
This budget demonstrates that the proposed system can be developed at a relatively low cost while still providing advanced features such as IoT monitoring, predictive machine learning analysis, and automated cooling control.

12. Conclusion
12.1 Summary of the Proposed System
This project proposes the development of IoT-AI food preservation system, an intelligent food storage system designed to improve the preservation of perishable fruits and vegetables. The system integrates Internet of Things (IoT) technology, thermoelectric cooling, and machine learning algorithms to monitor environmental conditions and predict fruit spoilage.
The proposed system uses sensors to continuously measure environmental parameters such as temperature, humidity, and gas concentration inside the storage container. These sensor readings are transmitted to a cloud-based database where the data is stored and analyzed. A machine learning model processes the collected data to identify patterns and predict the likelihood of fruit spoilage.
In addition to predictive analysis, the system includes an automated cooling mechanism that regulates the internal temperature of the storage box. This helps maintain optimal storage conditions and slows down the biological processes responsible for fruit deterioration.

12.2 Significance of the Project
Food spoilage and post-harvest losses are significant challenges in many developing countries, including Rwanda. Farmers, small-scale vendors, and households often lack access to affordable and efficient storage systems for preserving perishable products.
The IoT-AI food preservation system addresses this problem by providing a low-cost smart storage solution that combines modern technologies with practical food preservation methods. The system enables users to monitor storage conditions in real time, receive early warnings of spoilage, and maintain optimal environmental conditions for fruit storage.
By improving food preservation, the proposed system has the potential to reduce food waste, increase the shelf life of fruits, and support better food supply management.

12.3 Contribution to Technology and Research
The proposed project contributes to the fields of embedded systems, Internet of Things, machine learning, and smart agriculture. It demonstrates how modern digital technologies can be applied to solve real-world problems related to food preservation and agricultural sustainability.
The integration of predictive machine learning models with sensor-based monitoring represents an innovative approach to intelligent storage systems. The project also provides a practical demonstration of how thermodynamic principles can be combined with IoT technologies to improve energy-efficient cooling systems.

12.4 Future Improvements
Although the proposed system focuses on fruit storage, the design can be extended to support other types of perishable foods such as vegetables and dairy products. Future improvements may include:
	Integration of mobile applications for remote monitoring and notifications.
	Implementation of more advanced machine learning models for improved prediction accuracy.
	Use of solar power to make the system energy efficient and suitable for rural areas.
	Integration with smart agricultural supply chain systems
	Supporting more than one fruit type in one box by implementing the new modal convolution neural network(CNN).
These improvements could further enhance the capabilities and practical applications of the project.

12.5 Final Remarks
The IoT-AI food preservation system demonstrates the potential of combining IoT monitoring, thermodynamic cooling, and machine learning prediction to create a smart food storage solution. The successful implementation of this project is expected to provide a practical and affordable approach to reducing food spoilage and improving food preservation.
By leveraging modern technologies, this project aims to contribute to the development of innovative solutions that support sustainable agriculture and food security in Rwanda and beyond.
