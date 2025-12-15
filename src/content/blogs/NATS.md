---
title: "All about NATS"
description: "Everything you need to know to get started."
date: "2025-12-15"
image: "/blog/NATS.webp"
---

# Basics

* NATS is a message-oriented middleware system that facilitates data exchange between applications/services.

![Alt text for screen readers](/blog/Pub_Sub.svg)

* NATS utilizes a subject-based messaging paradigm, which involves publishing and listening to messages on named communication channels known as Subjects. In other middleware systems subjects may be called topics, channels, streams (Note: In NATS the term stream is used for a JetStream message storage).

* NATS offers wildcard support to enable flexible subscriptions. Publishers send messages to fully specified subjects, but subscribers can use wildcards to listen to multiple subjects with a single subscription. NATS provides two wildcard characters (* and >) that can substitute for one or more elements within a dot-separated subject.

* The NATS messaging system offers two primary configurations: Core NATS, a lightweight publish-subscribe system, and NATS with JetStream, which adds persistence and advanced features for streaming and durable messaging.

For detailed instructions on how to install NATS, refer to the [Installation Walkthrough](https://docs.nats.io/nats-concepts/what-is-nats/walkthrough_setup).

# NATS vs Kafka

<script src="https://gist.github.com/rahularora27/45fdd958e8676c2ada54afa654599d82.js"></script>

