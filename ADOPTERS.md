# MCP x402 Adopters & Prospects

**Tracking which DePIN projects are using or considering the MCP x402 monetization pattern.**

---

## ✅ Live Implementations

| Project | Repository | Status | Data Type | Tools | Price Range |
|---------|------------|--------|-----------|-------|-------------|
| **Helium (SNTL)** | [substreambc/helium-mcp](https://github.com/substreambc/helium-mcp) | ✅ **Production** | Helium DePIN Intelligence | 10 tools | $0 - $0.05 USDC |

### Helium Tools:
- `helium_ledger` - FREE: Wallet payment + query history
- `helium_stats` - $0.01: Live threat event counts
- `helium_query` - $0.01: SQL SELECT over 285k events
- `helium_threats` - $0.01: Threat tier events
- `helium_anomalies` - $0.01: Highest anomaly-score events
- `helium_event` - $0.01: Single enriched event
- `helium_chronicle` - $0.05: Causal chains (233k rows)
- `helium_escalation` - $0.05: LLM verdict trail
- `helium_geo` - $0.05: H3 geospatial resolution
- `helium_wallets` - $0.05: Scored wallet audience pools

---

## 📋 Prospects (Issues Filed)

### Machine Identity & IoT
| Project | Repository | Issue | Status | Potential Data |
|---------|------------|-------|--------|----------------|
| peaq network | [peaqnetwork/peaq-network-node](https://github.com/peaqnetwork/peaq-network-node) | [#390](https://github.com/peaqnetwork/peaq-network-node/issues/390) | ⏳ Awaiting Response | Machine identities, IoT device data |

### Cellular & Wireless
| Project | Repository | Issue | Status | Potential Data |
|---------|------------|-------|--------|----------------|
| Titan Network | [Titannet-dao/titan-node](https://github.com/Titannet-dao/titan-node) | [#78](https://github.com/Titannet-dao/titan-node/issues/78) | ⏳ Awaiting Response | Cellular coverage, connectivity |

### Vision & Camera
| Project | Repository | Issue | Status | Potential Data |
|---------|------------|-------|--------|----------------|
| Natix Vision SDK | [natix-io/vsdkx-core](https://github.com/natix-io/vsdkx-core) | [#15](https://github.com/natix-io/vsdkx-core/issues/15) | ⏳ Awaiting Response | Camera feeds, vision processing |

### Geospatial & RTK
| Project | Repository | Issue | Status | Potential Data |
|---------|------------|-------|--------|----------------|
| GEODNET API | [geodnet/GEODNET_API](https://github.com/geodnet/GEODNET_API) | [#1](https://github.com/geodnet/GEODNET_API/issues/1) | ⏳ Awaiting Response | RTK correction data |
| GEODNET RTK Service | [geodnet/GEODNET_RTK_SERVICE](https://github.com/geodnet/GEODNET_RTK_SERVICE) | [#1](https://github.com/geodnet/GEODNET_RTK_SERVICE/issues/1) | ⏳ Awaiting Response | RTK base station data |

### Hivemapper (Geospatial Mapping)
| Project | Repository | Issue | Status | Potential Data |
|---------|------------|-------|--------|----------------|
| HDC Firmware | [Hivemapper/hdc_firmware](https://github.com/Hivemapper/hdc_firmware) | [#263](https://github.com/Hivemapper/hdc_firmware/issues/263) | ⏳ Awaiting Response | Road coverage, dashcam imagery |
| Imagery QGIS Plugin | [Hivemapper/hivemapper-imagery-qgis-plugin](https://github.com/Hivemapper/hivemapper-imagery-qgis-plugin) | [#2](https://github.com/Hivemapper/hivemapper-imagery-qgis-plugin/issues/2) | ⏳ Awaiting Response | Mapping telemetry |
| Hive-py | [Hivemapper/hive-py](https://github.com/Hivemapper/hive-py) | [#84](https://github.com/Hivemapper/hive-py/issues/84) | ⏳ Awaiting Response | Geospatial data |
| ODC | [Hivemapper/odc](https://github.com/Hivemapper/odc) | [#2](https://github.com/Hivemapper/odc/issues/2) | ⏳ Awaiting Response | Mapping data |
| Data Logger | [streamingfast/hivemapper-data-logger](https://github.com/streamingfast/hivemapper-data-logger) | [#9](https://github.com/streamingfast/hivemapper-data-logger/issues/9) | ⏳ Awaiting Response | Geospatial telemetry |

### Integration Partners
| Project | Repository | PR | Status | Type |
|---------|------------|-----|--------|------|
| Coin Railz Agent | [tdnupe3/coinrailz-agent](https://github.com/tdnupe3/coinrailz-agent) | [#1](https://github.com/tdnupe3/coinrailz-agent/pull/1) | ⏳ Awaiting Response | Cross-verification integration |

---

## 🎯 Next Outreach Targets

| Priority | Project | Data Type | Issue Template | Status |
|----------|---------|-----------|----------------|--------|
| 1 | **Render Network** | GPU Rendering | [OUTREACH/render_issue.md](OUTREACH/render_issue.md) | ⏳ Not yet contacted |
| 2 | **Silent Data** | Wireless Network | [OUTREACH/silentdata_issue.md](OUTREACH/silentdata_issue.md) | ⏳ Not yet contacted |
| 3 | **Dymension** | RollApp Data | [OUTREACH/dymension_issue.md](OUTREACH/dymension_issue.md) | ⏳ Not yet contacted |

---

## 📈 Metrics

### Outreach Statistics
- **Total Projects Contacted**: 8 organizations
- **Total Issues Filed**: 17
- **Unique Repositories**: 12
- **Response Rate**: 0/17 (0%) - *Campaign just started*
- **Adoption Rate**: 0/17 (0%) - *Campaign just started*

### Data Categories Covered
- ✅ IoT & Machine Identity
- ✅ Cellular Network
- ✅ Vision & Camera
- ✅ Geospatial & Mapping
- ✅ RTK Correction
- 🎯 GPU Rendering (planned)
- 🎯 Wireless Network (planned)
- 🎯 RollApp/Blockchain (planned)

---

## 🚀 How to Adopt

If you're a DePIN project wanting to adopt MCP x402:

1. **Fork** the [helium-mcp](https://github.com/substreambc/helium-mcp) repository
2. **Edit** `src/registry.mjs` with your tools and prices
3. **Update** `src/rail.mjs` to hit your API endpoints
4. **Configure** your treasury address
5. **Publish** to npm: `npm publish`
6. **Announce** to your community

---

## 💬 Get in Touch

- **Reference Implementation**: [substreambc/helium-mcp](https://github.com/substreambc/helium-mcp)
- **Documentation**: [README.md](README.md)
- **Agent Guide**: [docs/AGENTS.md](docs/AGENTS.md)
- **Ecosystem Tracking**: [ECOSYSTEM.md](ECOSYSTEM.md)

---

**Pattern by [Web3 Solutions, LLC](https://sntl.site)** — Copy it. Use it. Profit.

*Last updated: 2026-07-19*
