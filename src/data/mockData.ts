import { ServiceItem } from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  // 1. PSIRA
  {
    id: 'psira-security-officer',
    categoryId: 'government',
    categoryName: 'Government & Public Services',
    title: 'PSIRA Security Officer Assistance',
    shortDescription: 'Guidance with PSIRA online portal, renewal of security registration, and certificate downloads.',
    detailedGuide: 'We assist private security officers and training graduates to navigate the PSIRA online portal for registration renewal, updating criminal clearance documentation, checking verification status, and downloading your digital PSIRA certificate.',
    officialUrl: 'https://digitalservices.psira.co.za',
    officialName: 'PSIRA Digital Services',
    isExternalOfficial: true,
    requiredDocuments: ['Certified ID copy', 'PSIRA Registration Number (if renewing)', 'Training Certificates (Grades E, D, C, B, or A)', 'Proof of payment of official PSIRA fee'],
    turnaroundTime: '1 - 2 business days',
    feeZAR: 120,
    popular: true,
    badge: 'Security',
    disclaimer: 'ScentCafe helps security personnel format and submit documents online. PSIRA accreditation is issued solely by the Private Security Industry Regulatory Authority.'
  },

  // 2. Home Affairs
  {
    id: 'home-affairs-assistance',
    categoryId: 'government',
    categoryName: 'Government & Public Services',
    title: 'Home Affairs Smart ID & Passport Guidance',
    shortDescription: 'Assistance with Department of Home Affairs Branch Appointment Booking System (BABS) and requirements.',
    detailedGuide: 'Avoid long queues by booking an appointment at a designated Home Affairs branch or participating bank branch (e.g. FNB, Standard Bank, Nedbank, ABSA). We assist in verifying required documents and securing your digital booking.',
    officialUrl: 'https://services.dha.gov.za/#/babs/verify-id',
    officialName: 'DHA BABS Online Booking System',
    isExternalOfficial: true,
    requiredDocuments: ['Current Green Barcoded ID or Smart ID', 'Birth Certificate (for first-time applicants)', 'Marriage Certificate (for surname changes)', 'Proof of residential address'],
    turnaroundTime: 'Same day booking guidance',
    feeZAR: 120,
    popular: true,
    badge: 'Essential',
    disclaimer: 'ScentCafe assists you in navigating the DHA appointment portal. Official government passport and Smart ID fees are payable directly to the Department of Home Affairs.'
  },

  // 3. First Home Finance
  {
    id: 'first-home-finance-flisp',
    categoryId: 'government',
    categoryName: 'Government & Public Services',
    title: 'First Home Finance (FLISP) Assistance',
    shortDescription: 'Assistance applying for the government First Home Finance (formerly FLISP) housing subsidy.',
    detailedGuide: 'First Home Finance is a Department of Human Settlements programme administered by the NHFC to help first-time South African home buyers earning between R3,501 and R22,000 per month. We guide you through eligibility criteria, required documentation, and application packaging for bank home loans or serviced sites.',
    officialUrl: 'https://www.nhfc.co.za/programmes/first-home-finance/',
    officialName: 'National Housing Finance Corporation (NHFC)',
    isExternalOfficial: true,
    requiredDocuments: ['Certified South African ID copy', 'Approved Home Loan in Principle / Bank Pre-Approval', '3 to 6 months stamped bank statements', 'Latest 3 months payslips', 'Marriage certificate / dependents birth certificates (if applicable)'],
    turnaroundTime: '2 - 4 business days',
    feeZAR: 250,
    badge: 'Housing',
    disclaimer: 'ScentCafe assists in pre-screening eligibility and document preparation. Subsidy approval and payouts are determined solely by NHFC and provincial Human Settlements departments.'
  },

  // 4. UIF
  {
    id: 'uif-labour-assistance',
    categoryId: 'government',
    categoryName: 'Government & Public Services',
    title: 'UIF & Department of Labour Assistance',
    shortDescription: 'Assistance with UIF uFiling online registration, unemployment, maternity, and illness benefit claims.',
    detailedGuide: 'We assist retrenched, unemployed, or expectant workers register on the Department of Employment and Labour uFiling system, fill in UI-19, UI-2.8, and UI-2.7 employer declaration forms, and track the status of your monthly payout claims.',
    officialUrl: 'https://ufiling.labour.gov.za/uif/',
    officialName: 'uFiling Department of Labour',
    isExternalOfficial: true,
    requiredDocuments: ['South African ID copy', 'Completed UI-19 & UI-2.7 forms from employer', 'UI-2.8 form signed and stamped by your bank', 'Salary advice slips (last 3 months)'],
    turnaroundTime: '2 - 3 business days',
    feeZAR: 150,
    popular: true,
    badge: 'High Demand',
    disclaimer: 'ScentCafe prepares and formats documentation according to Department of Labour specifications. Unemployment Insurance Fund disbursements are solely made by the South African Government.'
  },

  // 5. NATIS
  {
    id: 'natis-licence-assistance',
    categoryId: 'government',
    categoryName: 'Government & Public Services',
    title: 'NaTIS Driving Licence & Vehicle Disc Assistance',
    shortDescription: 'Online appointment scheduling for Driving Licence Card renewals, PrDPs, and vehicle license disc renewals.',
    detailedGuide: 'Guidance for scheduling your Driving Licence Card renewal or PrDP appointment through the official eNaTIS online system (Gauteng, Eastern Cape, and national booking centres), preparing eye test documents, and guidance on vehicle licence disc renewals.',
    officialUrl: 'https://online.natis.gov.za',
    officialName: 'eNaTIS Online Portal',
    isExternalOfficial: true,
    requiredDocuments: ['South African ID copy', 'Current Driving Licence Card', 'Proof of postal/residential address (not older than 3 months)', '4 black and white ID photos'],
    turnaroundTime: '1 business day',
    feeZAR: 110,
    badge: 'Transport',
    disclaimer: 'ScentCafe assists with appointment slot booking on eNaTIS. All vehicle licensing fees are paid directly to the DLTC or relevant provincial licensing authority.'
  },

  // 6. Biz portal
  {
    id: 'bizportal-registration',
    categoryId: 'business',
    categoryName: 'Business & Digital Admin',
    title: 'BizPortal Company Registration',
    shortDescription: 'Full online company incorporation via BizPortal with name reservation and automatic SARS income tax number.',
    detailedGuide: 'Fast, hassle-free (Pty) Ltd company formation using the government BizPortal gateway. We guide you through selecting a unique company name, director registration, generating your COR14.3 certificate, and automatic tax number registration.',
    officialUrl: 'https://bizportal.gov.za',
    officialName: 'BizPortal CIPC Platform',
    isExternalOfficial: true,
    requiredDocuments: ['Certified ID copies of all directors', 'Physical residential addresses of all directors', '4 proposed unique company names in order of preference', 'Valid cell number and email'],
    turnaroundTime: '2 - 4 business days',
    feeZAR: 350,
    popular: true,
    badge: 'Business',
    disclaimer: 'Statutory incorporation fees are charged by CIPC. ScentCafe facilitates digital portal data capture and document uploads.'
  },

  // 7. Matric results
  {
    id: 'matric-results-assistance',
    categoryId: 'education',
    categoryName: 'Education & Admissions',
    title: 'Matric Results & Certificate Assistance',
    shortDescription: 'Guidance with Department of Basic Education statement of matric results, Umalusi certificate re-issues, and remark applications.',
    detailedGuide: 'Assistance retrieving official National Senior Certificate (NSC) or Senior Certificate (SC) statements of results, applying for replacement Umalusi certificates for lost or damaged documents, and submitting re-mark or re-check requests.',
    officialUrl: 'https://www.education.gov.za/Informationfor/Learners/StatementofResults.aspx',
    officialName: 'Department of Basic Education / Umalusi',
    isExternalOfficial: true,
    requiredDocuments: ['Certified South African ID copy', 'Examination year and center or school name', 'Affidavit in case of lost original certificate', 'Proof of payment to DBE / Umalusi'],
    turnaroundTime: '1 - 3 business days',
    feeZAR: 120,
    badge: 'Academics',
    disclaimer: 'Official certificate replacements are produced and distributed by Umalusi and the Department of Basic Education.'
  },

  // 8. CIPC
  {
    id: 'cipc-compliance',
    categoryId: 'business',
    categoryName: 'Business & Digital Admin',
    title: 'CIPC Company Services & Compliance',
    shortDescription: 'File annual returns, retrieve company disclosure certificates (COR14.3), and check company deregistration status.',
    detailedGuide: 'Maintain your company in active status with the Companies and Intellectual Property Commission (CIPC). We guide you through calculating turnover penalties, filing annual return statements, downloading official MOI documents, and checking status.',
    officialUrl: 'https://www.cipc.co.za',
    officialName: 'CIPC Official Portal',
    isExternalOfficial: true,
    requiredDocuments: ['Company Registration Number (e.g. 2026/123456/07)', 'Director South African ID', 'Financial year turnover declaration'],
    turnaroundTime: '1 - 2 business days',
    feeZAR: 200,
    badge: 'Compliance',
    disclaimer: 'CIPC statutory annual return fees are paid directly to the commission. ScentCafe provides filing facilitation.'
  },

  // 9. CSD
  {
    id: 'csd-treasury-registration',
    categoryId: 'business',
    categoryName: 'Business & Digital Admin',
    title: 'CSD Central Supplier Database Registration',
    shortDescription: 'Register your enterprise on National Treasury CSD to qualify for government tenders, RFQs, and purchase orders.',
    detailedGuide: 'Assistance completing master registration on the National Treasury Central Supplier Database (CSD). We link your CIPC company details, verify director IDs, attach bank confirmation letters, and generate your unique Master Supplier Number (MAAA number).',
    officialUrl: 'https://secure.csd.gov.za',
    officialName: 'National Treasury CSD Portal',
    isExternalOfficial: true,
    requiredDocuments: ['CIPC Company Registration Certificate (COR14.3)', 'SARS Tax Compliance Status (TCS) PIN', 'Bank account confirmation letter (stamped)', 'Certified ID copies of company directors'],
    turnaroundTime: '1 - 2 business days',
    feeZAR: 250,
    popular: true,
    badge: 'Tenders',
    disclaimer: 'The Central Supplier Database is maintained by National Treasury. ScentCafe provides portal data entry and document facilitation.'
  },

  // 10. University
  {
    id: 'university-admissions',
    categoryId: 'education',
    categoryName: 'Education & Admissions',
    title: 'University Admissions & CAO Assistance',
    shortDescription: 'Guidance applying to South African universities (Wits, UCT, UP, UJ, UKZN, UNISA, NWU, TUT) and CAO.',
    detailedGuide: 'Assistance with university admission applications, calculating your Admission Point Score (APS) according to faculty guidelines, selecting alternative choices, and submitting CAO (Central Applications Office) applications in KwaZulu-Natal.',
    officialUrl: 'https://www.cao.ac.za',
    officialName: 'Central Applications Office & University Portals',
    isExternalOfficial: true,
    requiredDocuments: ['Grade 11 final results or Grade 12 Matric certificate', 'Certified ID copy', 'Academic transcripts (for transfer or postgraduate students)', 'Proof of application fee where applicable'],
    turnaroundTime: '1 - 2 business days',
    feeZAR: 150,
    popular: true,
    badge: 'Admissions',
    disclaimer: 'University admission and APS cut-off decisions rest solely with each university senate.'
  },

  // 11. SARS
  {
    id: 'sars-tax-assistance',
    categoryId: 'government',
    categoryName: 'Government & Public Services',
    title: 'SARS eFiling & Tax Return Assistance',
    shortDescription: 'Step-by-step assistance with SARS eFiling profile setup, tax returns, and Tax Compliance Status (PIN).',
    detailedGuide: 'We guide you through logging onto SARS eFiling, updating banking details, checking your auto-assessment, submitting individual income tax returns, and retrieving your official Tax Compliance Status (TCS) PIN for tenders or employment.',
    officialUrl: 'https://www.sarsefiling.co.za',
    officialName: 'SARS eFiling Portal',
    isExternalOfficial: true,
    requiredDocuments: ['South African ID copy', 'IRP5 / IT3(a) tax certificate from employer', 'Proof of medical scheme fees (if applicable)', 'Bank statement (stamped, not older than 3 months)'],
    turnaroundTime: '1 - 2 business days',
    feeZAR: 150,
    popular: true,
    badge: 'High Demand',
    disclaimer: 'ScentCafe provides administrative guidance and document formatting assistance. We are not SARS and cannot alter SARS tax policies or guarantee refund amounts.'
  },

  // 12. College
  {
    id: 'college-admissions',
    categoryId: 'education',
    categoryName: 'Education & Admissions',
    title: 'College Admissions Assistance',
    shortDescription: 'Assistance with Public TVET Colleges and private college enrollment applications and course selection.',
    detailedGuide: 'Comprehensive guidance applying for National Certificate Vocational (NCV) and NATED (N1-N6) courses at public TVET colleges (e.g. Ekurhuleni, False Bay, South West Gauteng, Northlink) and accredited private training colleges.',
    officialUrl: 'https://www.dhet.gov.za',
    officialName: 'Department of Higher Education and Training TVET',
    isExternalOfficial: true,
    requiredDocuments: ['Certified Matric Certificate or Grade 9/10/11 report', 'Certified ID copy', 'Proof of residential address', 'Next of kin contact information'],
    turnaroundTime: '1 business day',
    feeZAR: 110,
    badge: 'Admissions',
    disclaimer: 'College placement depends on subject criteria and seat availability as determined by each college admissions office.'
  },

  // 13. Bursary
  {
    id: 'bursary-nsfas-assistance',
    categoryId: 'education',
    categoryName: 'Education & Admissions',
    title: 'Bursary & NSFAS Application Assistance',
    shortDescription: 'Complete guidance applying for NSFAS student funding, provincial bursaries, and corporate scholarship schemes.',
    detailedGuide: 'We assist prospective and current tertiary students to navigate the myNSFAS portal, upload income declarations, submit appeals, and prepare applications for private sector and municipal bursaries (Funza Lushaka, Thuthuka, provincial education funds).',
    officialUrl: 'https://my.nsfas.org.za',
    officialName: 'NSFAS Official Portal',
    isExternalOfficial: true,
    requiredDocuments: ['Applicant ID copy', 'Parents / Guardian ID copies', 'Proof of household income (pay slips, affidavit, or SASSA confirmation)', 'Acceptance letter or student proof of registration'],
    turnaroundTime: '1 - 2 business days',
    feeZAR: 120,
    popular: true,
    badge: 'Funding',
    disclaimer: 'Bursary funding approvals are granted solely by NSFAS or the relevant sponsor.'
  },

  // 14. eLearning
  {
    id: 'elearning-skills-assistance',
    categoryId: 'careers',
    categoryName: 'Jobs and Careers',
    title: 'eLearning & Online Courses Assistance',
    shortDescription: 'Assistance enrolling in accredited online courses, e-Skills programmes, NEMISA, and digital literacy portals.',
    detailedGuide: 'Guidance registering for free and sponsored online courses (Coursera for Youth, NEMISA digital skills, Google Career Certificates, Cisco Networking Academy, and university MOOCs). We assist in profile setup, certificate download, and navigating virtual learning portals.',
    officialUrl: 'https://www.nemisa.co.za',
    officialName: 'National Electronic Media Institute of SA (NEMISA)',
    isExternalOfficial: true,
    requiredDocuments: ['Valid email address', 'South African ID', 'Device details (smartphone or laptop for course prerequisites)'],
    turnaroundTime: 'Same day',
    feeZAR: 85,
    badge: 'Skills',
    disclaimer: 'Courses and certifications are administered by the respective education provider.'
  },

  // 15. Job portals
  {
    id: 'job-portals-assistance',
    categoryId: 'careers',
    categoryName: 'Jobs and Careers',
    title: 'Job Portals & Z83 Application Assistance',
    shortDescription: 'Setup professional profiles on Pnet, Careers24, Indeed, and submission of the new gazetted Government Z83 form.',
    detailedGuide: 'Create standout candidate profiles across South Africa\'s top recruitment platforms (PNet, Careers24, LinkedIn, Indeed) and get guidance completing the official Government Z83 employment form with correct references and department codes.',
    officialUrl: 'https://www.dpsa.gov.za/dpsa2g/vacancies.asp',
    officialName: 'DPSA Government Vacancies Portal',
    isExternalOfficial: true,
    requiredDocuments: ['Updated CV draft', 'Certified ID copy', 'Certificates and academic transcripts', 'Target job vacancy advertisement or reference number'],
    turnaroundTime: '24 hours',
    feeZAR: 120,
    popular: true,
    badge: 'Employment',
    disclaimer: 'ScentCafe formats and uploads application profiles. Hiring decisions rest with the recruiting department or employer.'
  },

  // 16. Professional CV
  {
    id: 'professional-cv-assistance',
    categoryId: 'careers',
    categoryName: 'Jobs and Careers',
    title: 'Professional CV & ATS Formatting',
    shortDescription: 'High-impact South African CV formatting, professional summary drafting, and Applicant Tracking System (ATS) optimization.',
    detailedGuide: 'Receive a modern, ATS-compliant South African curriculum vitae tailored for recruiters. Features clear chronological work experience, relevant skills section, South African ID and language profiling, and an impactful cover letter template.',
    requiredDocuments: ['Previous CV draft or list of work history and dates', 'Educational certificates / Matric certificate copy', 'Target job title or industry'],
    turnaroundTime: '24 - 48 hours',
    feeZAR: 180,
    popular: true,
    badge: 'High Impact',
    disclaimer: 'A well-formatted CV significantly improves interview invite rates. ScentCafe does not guarantee employment or hiring decisions by third-party recruiters.'
  },

  // 17. CIPC assistance
  {
    id: 'cipc-assistance-services',
    categoryId: 'business',
    categoryName: 'Business & Digital Admin',
    title: 'CIPC Assistance (Amendments & Director Changes)',
    shortDescription: 'Specialized assistance for CIPC director additions/removals (COR39), company name changes, and address updates.',
    detailedGuide: 'Assistance with post-registration CIPC administrative filings including appointing or resigning company directors (COR39), updating registered office and postal addresses (COR21.1), company name amendments, and retrieval of certified founding documents.',
    officialUrl: 'https://www.cipc.co.za',
    officialName: 'CIPC eServices',
    isExternalOfficial: true,
    requiredDocuments: ['Company Registration Number', 'Certified ID copies of incoming and outgoing directors', 'Director consent letters / resignation letters', 'Minutes of resolution'],
    turnaroundTime: '2 - 5 business days',
    feeZAR: 280,
    badge: 'Corporate',
    disclaimer: 'Statutory amendments are vetted and updated on the public company register by CIPC.'
  },

  // 18. BizPortal assistance
  {
    id: 'bizportal-assistance-suite',
    categoryId: 'business',
    categoryName: 'Business & Digital Admin',
    title: 'BizPortal Assistance (B-BBEE & Statutory Registrations)',
    shortDescription: 'Assistance registering for B-BBEE affidavits, Compensation Fund (COIDA), and Unemployment Insurance via BizPortal.',
    detailedGuide: 'Specialized facilitation on BizPortal beyond initial company formation. We assist qualifying Exempted Micro Enterprises (EMEs) with turnover under R10m to generate an official CIPC B-BBEE affidavit, register with the Compensation Commissioner (COIDA), and link domain names.',
    officialUrl: 'https://bizportal.gov.za/services.aspx',
    officialName: 'BizPortal Value-Added Services',
    isExternalOfficial: true,
    requiredDocuments: ['CIPC Company Registration Certificate', 'Shareholding breakdown and director IDs', 'Latest financial statements or estimated turnover declaration'],
    turnaroundTime: '1 - 3 business days',
    feeZAR: 220,
    badge: 'Enterprise',
    disclaimer: 'ScentCafe provides administrative guidance. Official B-BBEE certificates and COIDA numbers are issued by statutory authorities.'
  },

  // 19. CSD assistance
  {
    id: 'csd-assistance-maintenance',
    categoryId: 'business',
    categoryName: 'Business & Digital Admin',
    title: 'CSD Assistance (Maintenance & Banking Verification)',
    shortDescription: 'Assistance updating CSD commodities, re-linking expired SARS tax PINs, and resolving bank verification failures.',
    detailedGuide: 'Keep your National Treasury CSD status active and 100% compliant so you never miss a tender or RFQ deadline. We assist with adding industry commodity codes, updating director changes, re-verifying bank accounts, and re-linking active SARS tax compliance PINs.',
    officialUrl: 'https://secure.csd.gov.za',
    officialName: 'National Treasury CSD Portal',
    isExternalOfficial: true,
    requiredDocuments: ['CSD Supplier Number (MAAA number)', 'Active SARS Tax Compliance Status PIN', 'Current bank confirmation letter with bank stamp', 'Updated director IDs'],
    turnaroundTime: '1 business day',
    feeZAR: 180,
    badge: 'Maintenance',
    disclaimer: 'CSD profile status and verification is managed directly by the National Treasury.'
  }
];
