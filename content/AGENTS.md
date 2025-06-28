# Content Management System - AI Agent Configuration
# /content/AGENTS.md

## System Overview

This AGENTS.md file orchestrates AI-powered content management within an enterprise-grade editorial workflow system. It integrates with headless CMS architecture, automated editorial workflows, and multi-channel publishing platforms.

## Core Agent Definitions

### Content Strategy Agent
**Role**: Strategic content planning and ideation
**Capabilities**: Market analysis, content gap identification, editorial calendar optimization

```yaml
name: content_strategist
model: gpt-4-turbo
temperature: 0.7
max_tokens: 2000
system_prompt: |
  You are an expert Content Strategist for an enterprise news and analysis platform. Your role is to:
  
  1. **Strategic Planning**: Analyze market trends, competitor content, and audience engagement data
  2. **Content Ideation**: Generate high-value content ideas aligned with business objectives
  3. **Editorial Calendar**: Optimize publication schedules for maximum engagement
  4. **Performance Analysis**: Evaluate content performance and recommend improvements
  
  **Context Access**: You have access to:
  - Analytics dashboards (Google Analytics 4, Mixpanel)
  - Competitor analysis tools
  - Audience engagement metrics
  - SEO performance data
  
  **Output Format**: Provide actionable recommendations with data-driven justifications.
  Always include confidence ratings and success metrics for your suggestions.

functions:
  - analyze_market_trends
  - generate_content_ideas
  - optimize_publishing_schedule
  - evaluate_content_performance
```

### Content Creation Agent
**Role**: AI-assisted content generation and optimization
**Capabilities**: Article writing, SEO optimization, multi-format content creation

```yaml
name: content_creator
model: gpt-4-turbo
temperature: 0.6
max_tokens: 4000
system_prompt: |
  You are an expert Content Creator specializing in enterprise-grade journalism and analysis.
  
  **Primary Functions**:
  1. **Content Generation**: Create high-quality articles, analysis pieces, and news content
  2. **SEO Optimization**: Ensure content meets search engine optimization standards
  3. **Multi-format Adaptation**: Adapt content for web, social media, newsletters, and RSS
  4. **Quality Assurance**: Maintain editorial standards and brand voice consistency
  
  **Technical Requirements**:
  - Integrate with Contentful/Strapi CMS APIs
  - Follow established content taxonomy and tagging systems
  - Ensure readability scores of 70+ (Flesch-Kincaid scale)
  - Comply with accessibility standards (WCAG 2.1 AA)
  
  **Workflow Integration**: 
  - Transition content through defined workflow states (draft → review → editing)
  - Trigger appropriate notifications and assignments
  - Update project management tools (Notion, Airtable, Monday.com)

functions:
  - generate_article_content
  - optimize_for_seo
  - create_social_media_variants
  - check_readability_score
  - update_cms_content
```

### Editorial Review Agent
**Role**: Automated content review and quality assurance
**Capabilities**: Fact-checking, style compliance, editorial feedback

```yaml
name: editorial_reviewer
model: claude-3-sonnet
temperature: 0.3
max_tokens: 3000
system_prompt: |
  You are an expert Editorial Reviewer with deep expertise in journalism standards and quality assurance.
  
  **Review Responsibilities**:
  1. **Fact Verification**: Cross-reference claims with authoritative sources
  2. **Editorial Standards**: Ensure compliance with style guide and editorial policies
  3. **Quality Assessment**: Evaluate content clarity, structure, and engagement potential
  4. **Revision Recommendations**: Provide specific, actionable feedback for improvements
  
  **Review Criteria**:
  - Accuracy: All facts verified against primary sources
  - Clarity: Information presented clearly and logically
  - Completeness: All necessary context and background provided
  - Bias Detection: Identify and flag potential bias or unbalanced reporting
  - Legal Compliance: Flag potential legal issues or required disclaimers
  
  **Output Requirements**:
  - Structured review reports with scoring (1-10 scale)
  - Specific revision recommendations with priority levels
  - Approval/rejection decisions with detailed justifications

functions:
  - fact_check_content
  - analyze_editorial_quality
  - detect_bias_issues
  - generate_review_report
  - recommend_revisions
```

### Publication Automation Agent
**Role**: Multi-channel content distribution and optimization
**Capabilities**: Cross-platform publishing, social media optimization, newsletter management

```yaml
name: publication_manager
model: gpt-4-turbo
temperature: 0.4
max_tokens: 2000
system_prompt: |
  You are a Publication Manager responsible for optimizing content distribution across multiple channels.
  
  **Distribution Channels**:
  1. **Website Publishing**: Deploy to primary website with proper formatting
  2. **Social Media**: Create optimized posts for Twitter, LinkedIn, Facebook
  3. **Newsletter Integration**: Format content for email distribution
  4. **RSS Feeds**: Update syndication feeds
  5. **Third-party Platforms**: Distribute to Medium, industry publications
  
  **Optimization Tasks**:
  - A/B test headlines and social media copy
  - Schedule publications for optimal engagement times
  - Generate platform-specific content variants
  - Monitor publication performance and adjust strategies
  
  **Technical Integration**:
  - Connect with social media APIs (Twitter, LinkedIn, Facebook)
  - Interface with email marketing platforms (Mailchimp, SendGrid)
  - Update content management systems and analytics

functions:
  - publish_to_website
  - create_social_media_posts
  - schedule_newsletter_content
  - update_rss_feeds
  - monitor_publication_metrics
```

## Workflow Integration

### State Machine Integration
Connect with the ContentWorkflowEngine to automate editorial progression:

```yaml
workflow_triggers:
  content_creation:
    - trigger: "start_writing"
    - agent: content_creator
    - next_state: "draft"
    
  content_review:
    - trigger: "submit_for_review"
    - agent: editorial_reviewer
    - next_state: "review"
    
  content_revision:
    - trigger: "request_revision"
    - agent: content_creator
    - next_state: "revision"
    
  content_approval:
    - trigger: "approve_for_publication"
    - agent: publication_manager
    - next_state: "scheduled"
```

### API Integration Endpoints

```yaml
api_integrations:
  cms_endpoints:
    contentful: "https://api.contentful.com/spaces/{space_id}"
    strapi: "https://api.strapi.io/v4"
    
  project_management:
    notion: "https://api.notion.com/v1"
    airtable: "https://api.airtable.com/v0"
    monday: "https://api.monday.com/v2"
    
  analytics:
    google_analytics: "https://analyticsreporting.googleapis.com/v4"
    mixpanel: "https://mixpanel.com/api/2.0"
    
  social_media:
    twitter: "https://api.twitter.com/2"
    linkedin: "https://api.linkedin.com/v2"
    facebook: "https://graph.facebook.com/v18.0"
```

## Security and Permissions

### Role-Based Access Control

```yaml
security_roles:
  content_strategist:
    permissions:
      - read: analytics_data, market_research
      - write: content_ideas, editorial_calendar
      - execute: trend_analysis, performance_reports
      
  content_creator:
    permissions:
      - read: content_briefs, style_guides, research_materials
      - write: draft_content, seo_metadata, social_variants
      - execute: content_generation, cms_updates
      
  editorial_reviewer:
    permissions:
      - read: draft_content, fact_sources, editorial_guidelines
      - write: review_reports, revision_requests, approval_decisions
      - execute: fact_checking, quality_analysis
      
  publication_manager:
    permissions:
      - read: approved_content, publication_schedules, performance_data
      - write: publication_metadata, distribution_schedules
      - execute: multi_channel_publishing, performance_monitoring
```

### Environment Variables

```yaml
required_environment_variables:
  # CMS Integration
  CONTENTFUL_SPACE_ID: "Required for Contentful CMS integration"
  CONTENTFUL_ACCESS_TOKEN: "Content delivery API access"
  CONTENTFUL_MANAGEMENT_TOKEN: "Content management API access"
  
  # AI Model Access
  OPENAI_API_KEY: "GPT-4 API access for content generation"
  ANTHROPIC_API_KEY: "Claude API access for editorial review"
  
  # Project Management
  NOTION_INTEGRATION_TOKEN: "Notion workspace integration"
  AIRTABLE_API_KEY: "Airtable base access"
  MONDAY_API_TOKEN: "Monday.com board management"
  
  # Analytics and Social Media
  GOOGLE_ANALYTICS_CREDENTIALS: "GA4 reporting API access"
  MIXPANEL_PROJECT_TOKEN: "User engagement analytics"
  TWITTER_BEARER_TOKEN: "Twitter API v2 access"
  LINKEDIN_ACCESS_TOKEN: "LinkedIn Publishing API"
  
  # Publication Infrastructure
  AWS_ACCESS_KEY_ID: "Cloud infrastructure access"
  AWS_SECRET_ACCESS_KEY: "S3 bucket and CDN management"
  SENDGRID_API_KEY: "Email newsletter distribution"
```

## Content Quality Standards

### Automated Quality Checks

```yaml
quality_standards:
  readability:
    flesch_kincaid_score: ">= 70"
    average_sentence_length: "<= 20 words"
    syllable_complexity: "moderate"
    
  seo_optimization:
    title_length: "50-60 characters"
    meta_description: "150-160 characters"
    keyword_density: "0.5-2.5%"
    internal_links: ">= 3 per article"
    
  accessibility:
    heading_structure: "proper h1-h6 hierarchy"
    alt_text: "required for all images"
    color_contrast: ">= 4.5:1 ratio"
    link_descriptions: "descriptive anchor text"
    
  editorial_standards:
    source_verification: "minimum 2 authoritative sources"
    fact_checking: "automated + manual verification"
    bias_detection: "political neutrality score >= 7/10"
    legal_compliance: "disclaimer and attribution checks"
```

### Performance Metrics

```yaml
success_metrics:
  content_quality:
    - editorial_score: ">= 8.0/10"
    - reader_engagement: ">= 3 minutes average time"
    - social_shares: ">= 50 shares per article"
    - seo_performance: "target keywords in top 10"
    
  workflow_efficiency:
    - time_to_publish: "<= 48 hours from assignment"
    - revision_cycles: "<= 2 rounds per article"
    - automation_coverage: ">= 80% of routine tasks"
    - error_reduction: ">= 90% decrease in manual errors"
    
  business_impact:
    - traffic_growth: ">= 15% monthly increase"
    - conversion_rate: ">= 3% reader-to-subscriber"
    - cost_efficiency: ">= 40% reduction in editorial costs"
    - team_productivity: ">= 60% increase in output"
```

## Advanced Features

### AI Model Orchestration

```yaml
model_coordination:
  content_generation:
    primary: "gpt-4-turbo"
    fallback: "gpt-3.5-turbo"
    cost_optimization: "prompt_compression_enabled"
    
  editorial_review:
    primary: "claude-3-sonnet"
    fallback: "gpt-4"
    specialized_tasks: "fact_checking, bias_detection"
    
  analytics_processing:
    primary: "gpt-4-turbo"
    specialized: "data_analysis, trend_identification"
    batch_processing: "enabled"
```

### Integration Monitoring

```yaml
monitoring_setup:
  api_health_checks:
    frequency: "every 5 minutes"
    endpoints: [cms, analytics, social_media, project_management]
    alert_threshold: "3 consecutive failures"
    
  performance_monitoring:
    response_times: "< 2 seconds average"
    error_rates: "< 1% failure rate"
    throughput: ">= 100 requests/minute"
    
  cost_monitoring:
    ai_api_costs: "daily budget alerts"
    infrastructure_costs: "monthly spending reports"
    efficiency_metrics: "cost per published article"
```

## Implementation Guidelines

### Deployment Checklist

1. **Environment Setup**
   - [ ] Configure all required environment variables
   - [ ] Test API connectivity to all integrated services
   - [ ] Verify security permissions and access controls
   - [ ] Set up monitoring and alerting systems

2. **Agent Configuration**
   - [ ] Deploy and test each agent individually
   - [ ] Verify workflow state transitions
   - [ ] Test error handling and fallback mechanisms
   - [ ] Validate output quality against standards

3. **Integration Testing**
   - [ ] End-to-end workflow testing
   - [ ] Multi-channel publishing verification
   - [ ] Performance and scalability testing
   - [ ] Security vulnerability assessment

4. **Production Readiness**
   - [ ] Load testing with realistic content volumes
   - [ ] Backup and disaster recovery procedures
   - [ ] Team training and documentation
   - [ ] Gradual rollout with monitoring

### Maintenance and Updates

```yaml
maintenance_schedule:
  daily:
    - Monitor agent performance metrics
    - Review and address any failed workflows
    - Update content performance analytics
    
  weekly:
    - Analyze cost optimization opportunities
    - Review and update content quality standards
    - Test backup and recovery procedures
    
  monthly:
    - Update AI model configurations
    - Review and optimize workflow efficiency
    - Assess integration health and performance
    - Security audit and compliance review
```

---

**Configuration Version**: 1.0.0  
**Last Updated**: June 28, 2025  
**Compatibility**: OpenAI Codex Enterprise, Contentful/Strapi CMS, Multi-platform publishing  
**Security Level**: Enterprise-grade with RBAC and comprehensive monitoring
