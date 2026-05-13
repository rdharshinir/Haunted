// ─── District-Level Job Radar Data ───
// Hyper-local job data for Tamil Nadu districts mapped to skills

export const DISTRICTS = [
  { id: 'coimbatore', name: 'Coimbatore', emoji: '🏭' },
  { id: 'chennai', name: 'Chennai', emoji: '🌆' },
  { id: 'madurai', name: 'Madurai', emoji: '🏛️' },
  { id: 'tirupur', name: 'Tirupur', emoji: '👕' },
  { id: 'salem', name: 'Salem', emoji: '⚙️' },
  { id: 'trichy', name: 'Trichy', emoji: '🏗️' },
  { id: 'erode', name: 'Erode', emoji: '🌾' },
  { id: 'thanjavur', name: 'Thanjavur', emoji: '🌾' },
  { id: 'vellore', name: 'Vellore', emoji: '🏥' },
  { id: 'tirunelveli', name: 'Tirunelveli', emoji: '🌿' },
];

export const JOBS_DATABASE = {
  coimbatore: [
    { title: 'CNC Machine Programmer', company: 'Lakshmi Machine Works', type: 'MSME', salary: '₹15-22K/mo', skills: ['for-loop', 'database'], hot: true, desc: 'Program CNC machines using G-code loops and parameter databases' },
    { title: 'Textile QC Data Entry', company: 'Pricol Ltd', type: 'MNC', salary: '₹12-18K/mo', skills: ['database', 'api'], desc: 'Enter and manage quality control data for textile production' },
    { title: 'IT Support Technician', company: 'Cognizant (Coimbatore)', type: 'MNC', salary: '₹18-25K/mo', skills: ['api', 'git'], desc: 'Maintain IT systems and troubleshoot network issues' },
    { title: 'Pump Motor IoT Technician', company: 'Texmo Industries', type: 'MSME', salary: '₹14-20K/mo', skills: ['api', 'ml'], hot: true, desc: 'Install and maintain IoT sensors on pump motors' },
    { title: 'Fabric Defect AI Trainer', company: 'Textile AI Startup', type: 'Startup', salary: '₹20-30K/mo', skills: ['ml', 'database'], hot: true, desc: 'Label and train AI models to detect fabric defects' },
  ],
  chennai: [
    { title: 'Junior Web Developer', company: 'Zoho Corp', type: 'MNC', salary: '₹25-35K/mo', skills: ['api', 'git', 'for-loop'], hot: true, desc: 'Build web applications using modern frameworks' },
    { title: 'Data Entry Operator', company: 'TCS', type: 'MNC', salary: '₹15-20K/mo', skills: ['database'], desc: 'Process and enter structured data into enterprise systems' },
    { title: 'API Testing Intern', company: 'Freshworks', type: 'MNC', salary: '₹18-22K/mo', skills: ['api', 'git'], desc: 'Test REST APIs and document results' },
    { title: 'ML Data Annotator', company: 'AI Startup Hub', type: 'Startup', salary: '₹16-24K/mo', skills: ['ml', 'database'], desc: 'Annotate training data for machine learning models' },
    { title: 'Auto Component Tracker', company: 'Hyundai Supply Chain', type: 'MNC', salary: '₹14-18K/mo', skills: ['database', 'api'], desc: 'Track auto components through supply chain systems' },
  ],
  madurai: [
    { title: 'Hospital MIS Operator', company: 'Meenakshi Mission Hospital', type: 'MSME', salary: '₹12-16K/mo', skills: ['database'], desc: 'Manage hospital management information systems' },
    { title: 'Agri-Data Collector', company: 'State Agri Dept', type: 'Govt', salary: '₹10-15K/mo', skills: ['database', 'api'], desc: 'Collect and digitize agricultural data for government programs' },
    { title: 'Temple Tourism App Helper', company: 'Local Startup', type: 'Startup', salary: '₹12-18K/mo', skills: ['api', 'git'], hot: true, desc: 'Help build and maintain temple tourism mobile app' },
    { title: 'Jasmine Supply Chain Tracker', company: 'Flower Export Co', type: 'MSME', salary: '₹10-14K/mo', skills: ['database'], desc: 'Digital tracking of jasmine flower supply chain' },
  ],
  tirupur: [
    { title: 'Garment ERP Operator', company: 'KPR Mill', type: 'MSME', salary: '₹14-20K/mo', skills: ['database', 'api'], hot: true, desc: 'Operate ERP systems for garment manufacturing workflow' },
    { title: 'Export Documentation Clerk', company: 'Tirupur Exporters Assn', type: 'MSME', salary: '₹12-16K/mo', skills: ['database'], desc: 'Process export documentation for textile shipments' },
    { title: 'Knitting Machine Programmer', company: 'Local Knitting Unit', type: 'MSME', salary: '₹15-22K/mo', skills: ['for-loop', 'api'], hot: true, desc: 'Program automated knitting patterns using loop logic' },
    { title: 'Quality AI Camera Operator', company: 'Smart Factory', type: 'Startup', salary: '₹18-25K/mo', skills: ['ml', 'api'], desc: 'Operate AI-powered cameras for garment quality inspection' },
  ],
  salem: [
    { title: 'Steel Plant Data Logger', company: 'Salem Steel Plant', type: 'PSU', salary: '₹16-22K/mo', skills: ['database', 'for-loop'], desc: 'Log production data from steel manufacturing processes' },
    { title: 'Sago Factory Automation', company: 'Local Sago Unit', type: 'MSME', salary: '₹12-16K/mo', skills: ['api', 'for-loop'], desc: 'Maintain automation systems in sago processing' },
    { title: 'Mango Export Tracker', company: 'Agri Export Ltd', type: 'MSME', salary: '₹10-15K/mo', skills: ['database', 'api'], hot: true, desc: 'Track mango harvest and export logistics digitally' },
  ],
  trichy: [
    { title: 'BHEL Apprentice (IT)', company: 'BHEL Trichy', type: 'PSU', salary: '₹14-18K/mo', skills: ['database', 'git'], hot: true, desc: 'IT apprenticeship at heavy electrical equipment manufacturer' },
    { title: 'Airport Cargo Tracker', company: 'Trichy Airport', type: 'Govt', salary: '₹15-20K/mo', skills: ['database', 'api'], desc: 'Track and manage cargo logistics at regional airport' },
    { title: 'College ERP Assistant', company: 'NIT Trichy (Outsourced)', type: 'MSME', salary: '₹12-16K/mo', skills: ['database'], desc: 'Assist with college ERP system operations' },
  ],
  erode: [
    { title: 'Turmeric Processing Logger', company: 'Erode Spice Market', type: 'MSME', salary: '₹10-14K/mo', skills: ['database'], desc: 'Log turmeric processing and trade data digitally' },
    { title: 'Textile Loom Programmer', company: 'Power Loom Unit', type: 'MSME', salary: '₹12-18K/mo', skills: ['for-loop', 'api'], hot: true, desc: 'Program power loom patterns using loop-based logic' },
    { title: 'Coconut Oil Supply Tracker', company: 'Oil Mill Coop', type: 'MSME', salary: '₹10-14K/mo', skills: ['database', 'api'], desc: 'Digital supply chain tracking for coconut oil production' },
  ],
  thanjavur: [
    { title: 'Rice Mill Data Operator', company: 'Cauvery Rice Mills', type: 'MSME', salary: '₹10-14K/mo', skills: ['database'], desc: 'Manage digital records for rice milling operations' },
    { title: 'Heritage Digitization Asst', company: 'ASI (Outsourced)', type: 'Govt', salary: '₹12-16K/mo', skills: ['database', 'ml'], hot: true, desc: 'Help digitize temple heritage records using AI tools' },
    { title: 'Agri Drone Data Analyst', company: 'AgTech Startup', type: 'Startup', salary: '₹15-22K/mo', skills: ['ml', 'api'], desc: 'Analyze drone-captured agricultural data' },
  ],
  vellore: [
    { title: 'Hospital Lab Data Entry', company: 'CMC Vellore (Outsourced)', type: 'MSME', salary: '₹12-16K/mo', skills: ['database'], desc: 'Enter and manage hospital laboratory test data' },
    { title: 'Leather QC Digitizer', company: 'Leather Export Co', type: 'MSME', salary: '₹12-18K/mo', skills: ['database', 'ml'], hot: true, desc: 'Digitize quality control processes for leather manufacturing' },
    { title: 'VIT Campus App Dev Intern', company: 'VIT Incubation', type: 'Startup', salary: '₹15-20K/mo', skills: ['api', 'git'], desc: 'Develop campus management app features' },
  ],
  tirunelveli: [
    { title: 'Banana Export Logger', company: 'Hill Banana Coop', type: 'MSME', salary: '₹10-14K/mo', skills: ['database'], desc: 'Log banana harvest and export data for cooperative' },
    { title: 'Wind Farm IoT Monitor', company: 'Suzlon (Tirunelveli)', type: 'MNC', salary: '₹16-22K/mo', skills: ['api', 'ml'], hot: true, desc: 'Monitor IoT sensors on wind turbines and log data' },
    { title: 'Palmyrah Product Tracker', company: 'Rural Craft Center', type: 'MSME', salary: '₹8-12K/mo', skills: ['database'], desc: 'Track palmyrah handicraft production and sales' },
  ],
};

// Map topic keywords to skill tags for matching
export const SKILL_MAP = {
  'api': ['api', 'What is an API?'],
  'for-loop': ['for-loop', 'What is a for-loop?'],
  'ml': ['ml', 'What is machine learning?'],
  'database': ['database', 'What is a database?'],
  'git': ['git', 'What is version control (Git)?'],
};

// Dream Project templates based on local industries
export const DREAM_PROJECT_SEEDS = [
  { keyword: 'textile', industry: 'Textile & Garment', district: 'Tirupur/Coimbatore', projects: ['Fabric defect detection using computer vision', 'Automated garment size classification', 'Supply chain tracker for cotton-to-cloth pipeline'] },
  { keyword: 'agriculture', industry: 'Agriculture', district: 'Thanjavur/Erode', projects: ['Crop disease detection from leaf images', 'Rainfall prediction model for irrigation planning', 'Mandi price prediction using historical data'] },
  { keyword: 'health', industry: 'Healthcare', district: 'Vellore/Chennai', projects: ['Patient queue optimization system', 'Lab report digitization using OCR', 'Rural telemedicine appointment scheduler'] },
  { keyword: 'temple', industry: 'Heritage & Tourism', district: 'Madurai/Thanjavur', projects: ['Temple crowd management system', 'Heritage site 3D documentation tool', 'Festival calendar and route planner app'] },
  { keyword: 'food', industry: 'Food Processing', district: 'Salem/Erode', projects: ['Spice quality grading using image AI', 'Food supply cold-chain temperature monitor', 'Recipe recommendation from available ingredients'] },
  { keyword: 'automobile', industry: 'Automotive', district: 'Chennai', projects: ['Spare part inventory predictor', 'Vehicle defect detection on assembly line', 'Fleet route optimization tool'] },
  { keyword: 'energy', industry: 'Renewable Energy', district: 'Tirunelveli/Coimbatore', projects: ['Wind turbine maintenance predictor', 'Solar panel efficiency tracker', 'Smart grid load balancing dashboard'] },
  { keyword: 'leather', industry: 'Leather & Exports', district: 'Vellore', projects: ['Leather quality grading AI', 'Export documentation automation', 'Tannery effluent monitoring system'] },
  { keyword: 'education', industry: 'EdTech', district: 'All Districts', projects: ['Personalized quiz generator for rural schools', 'Attendance tracking using face recognition', 'Vernacular language code compiler'] },
  { keyword: 'fishing', industry: 'Marine & Fishing', district: 'Ramanathapuram/Tuticorin', projects: ['Fish species identifier from photos', 'Tide and weather alert system for fishermen', 'Catch-to-market price optimizer'] },
];
