class Plan
  
  ## define constant, use all caps
  PLANS = [:free, :premium]
  
  def self.options
    PLANS.map {|plan| [plan.capitalize, plan]}
    # map method does: modifies all elements in an array
    ##whitelist this plan attribute
  end
end