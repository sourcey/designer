module PageDesigner
  class AttachmentCleanupJob < ActiveJob::Base
    def perform(resource)
      resource.attachments.eager_load(:blob).each do |a|
        # p a.metadata
        # next unless a.metadata[:designer_page_id] || a.metadata[:designer_block_id]
        # puts '-------------------------------------'
        # puts a.metadata[:designer_page_id]
        # puts a.metadata[:designer_block_id]
        # puts resource.find_page a.metadata[:designer_page_id]
        # puts resource.find_block a.metadata[:designer_block_id]

        if a.metadata[:designer_page_id] && !resource.find_page(a.metadata[:designer_page_id]) ||
          a.metadata[:designer_block_id] && !resource.find_block(a.metadata[:designer_block_id])

          # Purge or detach the attachment depending on if the blob is used elsewhere
          if ActiveStorage::Attachment.where.not(id: a.id).joins(:blob)
                                      .where(active_storage_blobs: {id: a.blob_id}).exists?
            a.detach
          else
            a.purge
          end
        end
      end
    end
  end
end
