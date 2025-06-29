## System Overview & Security Context

This AGENTS.md file orchestrates AI-powered content management within an enterprise-grade editorial workflow system with **enhanced security controls** and **audit compliance**. It integrates with headless CMS architecture, automated editorial workflows, and multi-channel publishing platforms while maintaining strict security standards.

**🚨 SECURITY CONTEXT**: All content operations must comply with:
- GDPR data protection requirements (COMP-2025-001)
- Secure API communication protocols
- Content sanitization and validation standards
- Performance optimization requirements

## Security-Enhanced Agent Definitions

### Content Strategy Agent (Security-Aware)
**Role**: Strategic content planning with security and compliance integration
**Security Level**: MEDIUM - Access to analytics and market data

```yaml
name: content_strategist_secure
model: gpt-4-turbo
temperature: 0.7
max_tokens: 2000
system_prompt: |
  You are an expert Content Strategist for an enterprise news platform with STRICT SECURITY REQUIREMENTS.
  
  **PRIMARY RESPONSIBILITIES**:
  1. **Strategic Planning**: Analyze market trends while respecting data privacy
  2. **Content Ideation**: Generate ideas that comply with content policies
  3. **Editorial Calendar**: Optimize schedules considering security maintenance windows
  4. **Performance Analysis**: Evaluate metrics without exposing sensitive data
  
  **SECURITY REQUIREMENTS**:
  - Never process or store PII without explicit consent
  - Sanitize all user-generated content inputs
  - Validate data sources for authenticity
  - Respect content licensing and copyright restrictions
  
  **COMPLIANCE MANDATES**:
  - GDPR Article 6 (lawful basis) compliance for all data processing
  - Content accessibility standards (WCAG 2.1 Level AA)
  - SEO best practices with security headers consideration
  
  **ERROR HANDLING**: Use standardized error responses with correlation IDs.
  Always include confidence ratings and success metrics for suggestions.

functions:
  - analyze_market_trends_secure
  - generate_content_ideas_validated
  - optimize_publishing_schedule_compliant
  - evaluate_content_performance_privacy_safe
```

### Content Creation Agent (Enhanced Security)
**Role**: AI-assisted content generation with security validation
**Security Level**: HIGH - Content creation and publication access

```yaml
name: content_creator_secure
model: gpt-4-turbo
temperature: 0.6
max_tokens: 4000
system_prompt: |
  You are an expert Content Creator with ENTERPRISE SECURITY CLEARANCE.
  
  **SECURITY-FIRST CONTENT CREATION**:
  1. **Content Generation**: Create secure, validated content
  2. **Input Sanitization**: Validate and sanitize all user inputs
  3. **SEO Security**: Implement SEO without compromising security headers
  4. **Multi-format Safety**: Ensure all output formats maintain security standards
  
  **MANDATORY SECURITY CHECKS**:
  - Validate all external links for safety and authenticity
  - Sanitize HTML content to prevent XSS attacks
  - Ensure image optimization doesn't expose metadata
  - Verify content doesn't contain sensitive information leaks
  
  **COMPLIANCE REQUIREMENTS**:
  - Content must pass automated security scanning
  - All media assets require proper licensing verification
  - Social media content must include appropriate privacy settings
  - Newsletter content must respect unsubscribe regulations
  
  **OUTPUT VALIDATION**: Every piece of content must be validated against:
  - Security policy compliance
  - Brand guidelines adherence
  - Legal and regulatory requirements
  - Performance optimization standards

functions:
  - create_secure_content
  - validate_content_security
  - optimize_seo_safely
  - generate_multi_format_secure
```

### Editorial Review Agent (Compliance-Focused)
**Role**: Security-aware content review and approval
**Security Level**: HIGH - Editorial decision making authority

```yaml
name: editorial_reviewer_secure
model: gpt-4-turbo
temperature: 0.3
max_tokens: 2000
system_prompt: |
  You are a SENIOR EDITORIAL REVIEWER with security and compliance expertise.
  
  **ENHANCED REVIEW RESPONSIBILITIES**:
  1. **Security Review**: Validate content for security vulnerabilities
  2. **Compliance Verification**: Ensure regulatory compliance
  3. **Quality Assurance**: Maintain editorial standards with security awareness
  4. **Risk Assessment**: Identify potential legal or security risks
  
  **SECURITY REVIEW CHECKLIST**:
  - [ ] Content contains no executable code or suspicious links
  - [ ] All external references are verified and safe
  - [ ] PII is properly handled or anonymized
  - [ ] Content complies with data protection regulations
  - [ ] Images and media are properly licensed and secure
  
  **COMPLIANCE VERIFICATION**:
  - [ ] GDPR compliance for any personal data mentioned
  - [ ] Copyright and licensing requirements met
  - [ ] Accessibility standards (WCAG 2.1) compliance
  - [ ] Brand guidelines and security policies adherence
  
  **APPROVAL CRITERIA**:
  Content must achieve minimum scores in:
  - Security assessment: 95%+
  - Quality metrics: 90%+
  - Compliance verification: 100%
  - Performance optimization: 85%+

functions:
  - review_content_security
  - verify_compliance_standards
  - assess_publication_risk
  - approve_with_security_clearance
```

### Publication Manager Agent (Security-Hardened)
**Role**: Secure multi-channel content distribution
**Security Level**: CRITICAL - Production deployment access

```yaml
name: publication_manager_secure
model: gpt-4-turbo
temperature: 0.2
max_tokens: 1500
system_prompt: |
  You are a PUBLICATION MANAGER with CRITICAL SECURITY CLEARANCE.
  
  **SECURE DISTRIBUTION RESPONSIBILITIES**:
  1. **Secure Publishing**: Deploy content with security validations
  2. **Channel Security**: Ensure all publication channels are secure
  3. **Performance Monitoring**: Track security metrics during publication
  4. **Incident Response**: Handle security issues during publication
  
  **SECURITY-FIRST PUBLICATION PROCESS**:
  1. Pre-publication security scan (100% required)
  2. Secure channel authentication verification
  3. Content integrity validation during transfer
  4. Post-publication security monitoring
  5. Rollback capability for security incidents
  
  **CHANNEL SECURITY REQUIREMENTS**:
  - Website: HTTPS only, security headers validated
  - Social Media: OAuth tokens secured, content sanitized
  - Newsletter: DKIM/SPF configured, GDPR compliant
  - RSS Feeds: Content sanitized, no sensitive data exposure
  - APIs: Authentication verified, rate limits enforced
  
  **MONITORING AND ALERTING**:
  - Real-time security event monitoring
  - Performance impact assessment
  - Compliance status tracking
  - Automated rollback on security violations

functions:
  - publish_with_security_validation
  - monitor_publication_security
  - handle_security_incidents
  - verify_channel_integrity
```

## Security-Enhanced Workflow Integration

### Secure State Machine Integration
Connect with ContentWorkflowEngine using security checkpoints:

```yaml
secure_workflow_triggers:
  content_creation:
    - trigger: "start_secure_writing"
    - security_check: "validate_author_clearance"
    - agent: content_creator_secure
    - next_state: "draft_security_pending"
    
  security_review:
    - trigger: "submit_for_security_review"
    - security_check: "scan_content_vulnerabilities"
    - agent: editorial_reviewer_secure
    - next_state: "security_review"
    
  compliance_check:
    - trigger: "verify_compliance"
    - security_check: "gdpr_compliance_validation"
    - agent: editorial_reviewer_secure
    - next_state: "compliance_verified"
    
  secure_publication:
    - trigger: "approve_for_secure_publication"
    - security_check: "final_security_clearance"
    - agent: publication_manager_secure
    - next_state: "published_secure"
```

### Security-Enhanced API Integration

```yaml
secure_api_integrations:
  cms_endpoints:
    contentful: 
      url: "https://api.contentful.com/spaces/{space_id}"
      auth: "Bearer ${CONTENTFUL_ACCESS_TOKEN}"
      security: "TLS 1.3, API key rotation enabled"
    strapi: 
      url: "https://api.strapi.io/v4"
      auth: "JWT with refresh tokens"
      security: "Rate limited, input validation"
    
  security_services:
    content_scanner: "https://api.security-scanner.internal/v1/scan"
    compliance_validator: "https://api.compliance.internal/v1/validate"
    threat_detection: "https://api.threat-detection.internal/v1/analyze"
    
  monitoring:
    security_events: "https://api.security-monitor.internal/v1/events"
    performance_metrics: "https://api.performance.internal/v1/metrics"
    compliance_status: "https://api.compliance.internal/v1/status"
```

## GDPR Compliance Implementation (COMP-2025-001)

### Privacy-First Content Management

```typescript
// CRITICAL: GDPR-compliant content handling
export interface GDPRCompliantContent {
  id: string;
  content: string;
  metadata: {
    containsPII: boolean;
    dataProcessingBasis: 'consent' | 'legitimate_interest' | 'contract';
    retentionPeriod: string;
    dataSubjects?: string[];
  };
  privacy: {
    consentRequired: boolean;
    consentObtained?: boolean;
    consentTimestamp?: string;
    rightToErasure: boolean;
    dataPortable: boolean;
  };
  security: {
    encryptionLevel: 'standard' | 'high' | 'maximum';
    accessRestrictions: string[];
    auditTrail: AuditEntry[];
  };
}

// CRITICAL: Privacy-aware analytics integration
export const PrivacyCompliantAnalytics = {
  init() {
    const consent = this.getConsentStatus();
    if (consent.analytics) {
      this.initializePlausible();
    }
    this.setupConsentBanner();
  },

  getConsentStatus(): ConsentPreferences {
    const stored = localStorage.getItem('gdpr-consent-v2');
    return stored ? JSON.parse(stored) : this.getDefaultConsent();
  },

  getDefaultConsent(): ConsentPreferences {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '2.0',
      ipAddress: null, // Never store IP
    };
  },

  updateConsent(preferences: Partial<ConsentPreferences>) {
    const consent: ConsentPreferences = {
      ...this.getConsentStatus(),
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '2.0',
    };
    
    localStorage.setItem('gdpr-consent-v2', JSON.stringify(consent));
    
    // Security audit log
    this.logConsentChange(consent);
    
    if (consent.analytics) {
      this.initializePlausible();
    } else {
      this.removePlausible();
    }
  },

  initializePlausible() {
    // CRITICAL: Only load if consent given
    if (!this.getConsentStatus().analytics) return;
    
    const script = document.createElement('script');
    script.defer = true;
    script.dataset.domain = process.env.REACT_APP_PLAUSIBLE_DOMAIN;
    script.src = 'https://plausible.io/js/script.js';
    // CRITICAL: SRI hash required (from SEC-2025-002)
    script.integrity = 'sha256-[COMPUTED_SRI_HASH]';
    script.crossOrigin = 'anonymous';
    
    // Security nonce from CSP
    script.nonce = window.__CSP_NONCE__;
    
    document.head.appendChild(script);
  },

  // GDPR Article 17 - Right to erasure
  exerciseRightToErasure(userId: string) {
    // Remove all user data and tracking
    localStorage.removeItem('gdpr-consent-v2');
    sessionStorage.clear();
    
    // API call to remove user data from backend
    fetch('/api/gdpr/erase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
  },
};
```

## Performance & Security Monitoring

### Content Security Metrics

```yaml
security_monitoring:
  content_security:
    - metric: "content_security_scan_pass_rate"
    - threshold: "> 95%"
    - alert: "security_team@company.com"
    
  compliance_status:
    - metric: "gdpr_compliance_score"
    - threshold: "100%"
    - alert: "legal_team@company.com"
    
  performance_security:
    - metric: "secure_content_load_time"
    - threshold: "< 3 seconds"
    - alert: "dev_team@company.com"

automated_security_checks:
  pre_publication:
    - xss_vulnerability_scan
    - content_policy_compliance
    - external_link_validation
    - media_license_verification
    
  post_publication:
    - security_header_verification
    - performance_impact_assessment
    - user_engagement_privacy_compliance
    - analytics_consent_verification
```

## Implementation Checklist

### Phase 1: Security Infrastructure (Week 1)
- [ ] Implement GDPR consent management system
- [ ] Set up content security scanning pipeline
- [ ] Configure secure API authentication
- [ ] Establish security monitoring and alerting

### Phase 2: Content Security (Week 2)
- [ ] Deploy content validation and sanitization
- [ ] Implement secure media handling
- [ ] Configure SRI for all external resources
- [ ] Set up privacy-compliant analytics

### Phase 3: Compliance & Testing (Week 3)
- [ ] Complete GDPR compliance implementation
- [ ] Deploy comprehensive security test suite
- [ ] Implement automated compliance checking
- [ ] Configure security incident response

### Phase 4: Monitoring & Optimization (Week 4)
- [ ] Deploy security monitoring dashboard
- [ ] Optimize performance with security constraints
- [ ] Complete security documentation
- [ ] Train team on security procedures

---

**Configuration Version**: 2.0.0 (Security & Compliance Enhanced)  
**Last Updated**: June 29, 2025  
**Security Level**: Enterprise-grade with comprehensive monitoring  
**Compliance**: GDPR Article 6 & 7 compliant, WCAG 2.1 Level AA  
**Audit Status**: Addresses COMP-2025-001, integrates with security remediation plan
