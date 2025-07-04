"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Campaign {
  id: string
  name: string
  crop: string
  totalArea: number
  startDate: string
  endDate: string
  harvestStart: string
  variety: string
}

interface CampaignSelectorProps {
  campaigns: Campaign[]
  selectedCampaign: Campaign | null
  onCampaignChange: (campaign: Campaign) => void
}

export function CampaignSelector({ campaigns, selectedCampaign, onCampaignChange }: CampaignSelectorProps) {
  return (
    <Card className="bg-slate-900/90 backdrop-blur-md border-slate-700/50 text-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Select
              value={selectedCampaign?.id}
              onValueChange={(value) => {
                const campaign = campaigns.find((c) => c.id === value)
                if (campaign) onCampaignChange(campaign)
              }}
            >
              <SelectTrigger className="w-64 bg-slate-800 border-slate-600 text-white">
                <SelectValue placeholder="Seleccionar campaña" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600 text-white">
                {campaigns.map((campaign) => (
                  <SelectItem key={campaign.id} value={campaign.id}>
                    {campaign.name} ({campaign.crop})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedCampaign && (
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-cyan-400 border-cyan-400">
                  {selectedCampaign.totalArea} Ha
                </Badge>
                <Badge variant="outline" className="text-green-400 border-green-400">
                  {selectedCampaign.variety}
                </Badge>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
