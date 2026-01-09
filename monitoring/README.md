
# Studio Monitoring Module

This module provides real-time integrity and security auditing for projects generated or managed within the Smart Hybrid Multimodal AI Studio.

## Components
- **ProjectWatcher**: Orchestrates the analysis loop.
- **Validator**: Contains the rulesets for project health.
- **AutoRepair**: Logic to solve common structural issues.
- **Logger**: Centralized event bus for system messages.

## Usage
The system is automatically wired to the `Sidebar.tsx` and observes the `project` state. Disabling the toggle stops the analysis loop but keeps log history.
